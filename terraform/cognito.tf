resource "aws_cognito_user_pool" "cancerbero" {
  name = "CancerberoPool"

  admin_create_user_config = {
    allow_admin_create_user_only = true
  }

  username_attributes = [
    "email"
  ]

  auto_verified_attributes = [
    "email"
  ]

  schema = {
    name = "given_name"
    attribute_data_type = "String"
    mutable = true
    required = true
  }


  device_configuration = {
    challenge_required_on_new_device = false
    device_only_remembered_on_user_prompt = false

  }
}

resource "aws_cloudformation_stack" "cancerbero_api_authorizer" {
  name = "CancerberoApiAuthorizer"

  template_body = <<STACK
{
  "AWSTemplateFormatVersion": "2010-09-09",
  "Resources": {
    "CancerberoApiAuthorizer": {
      "Type": "AWS::ApiGateway::Authorizer",
      "Properties": {
        "Name": "CancerberoApiAuthorizer",
        "Type": "COGNITO_USER_POOLS",
        "ProviderARNs": [
          "arn:aws:cognito-idp:${var.region}:${var.account_id}:userpool/${aws_cognito_user_pool.cancerbero.id}"
        ],
        "RestApiId": "${aws_api_gateway_rest_api.domo-slave-api.id}",
        "IdentitySource": "method.request.header.Authorization"
      }
    }
  },
  "Outputs": {
    "id": {
      "Value" : { "Ref" : "CancerberoApiAuthorizer" }
    }
  }
}
STACK
}

resource "aws_cloudformation_stack" "cancerbero_pool_app" {
  name = "CancerberoApp"

  template_body = <<STACK
{
  "AWSTemplateFormatVersion": "2010-09-09",
  "Resources": {
    "CancerberoApp": {
      "Type": "AWS::Cognito::UserPoolClient",
      "Properties": {
        "ClientName": "CancerberoApp",
        "GenerateSecret": true,
        "UserPoolId" : "${aws_cognito_user_pool.cancerbero.id}"
      }
    }
  },
  "Outputs": {
    "id": {
      "Value" : { "Ref" : "CancerberoApp" }
    }
  }
}
STACK
}

resource "aws_cloudformation_stack" "cancerbero_group_users" {
  name = "CancerberoGroupUsers"

  template_body = <<STACK
{
  "AWSTemplateFormatVersion": "2010-09-09",
  "Resources": {
    "CancerberoGroupUsers": {
      "Type": "AWS::Cognito::UserPoolGroup",
      "Properties": {
        "GroupName": "Users",
        "Precedence": 5,
        "RoleArn": "${aws_iam_role.cancerbero_user.arn}",
        "UserPoolId": "${aws_cognito_user_pool.cancerbero.id}"
      }
    }
  },
  "Outputs": {
    "id": {
      "Value": {
        "Ref": "CancerberoGroupUsers"
      }
    }
  }
}
STACK
}

resource "aws_cloudformation_stack" "cancerbero_group_admins" {
  name = "CancerberoGroupAdmins"

  template_body = <<STACK
{
  "AWSTemplateFormatVersion": "2010-09-09",
  "Resources": {
    "CancerberoGroupAdmins": {
      "Type": "AWS::Cognito::UserPoolGroup",
      "Properties": {
        "GroupName": "Admins",
        "Precedence": 0,
        "RoleArn": "${aws_iam_role.cancerbero_admin.arn}",
        "UserPoolId": "${aws_cognito_user_pool.cancerbero.id}"
      }
    }
  },
  "Outputs": {
    "id": {
      "Value": {
        "Ref": "CancerberoGroupAdmins"
      }
    }
  }
}
STACK
}


data "external" "cognito_user_pool_client" {
  program = [
    "aws",
    "cognito-idp",
    "describe-user-pool-client",
    "--user-pool-id",
    "${aws_cognito_user_pool.cancerbero.id}",
    "--client-id",
    "${aws_cloudformation_stack.cancerbero_pool_app.outputs["id"]}",
    "--region",
    "${var.region}",
    "--query",
    "{name:UserPoolClient.ClientName,id:UserPoolClient.ClientId,secret:UserPoolClient.ClientSecret}"
  ]
}

output "cognito_user_pool_id" {
  value = "${aws_cognito_user_pool.cancerbero.id}"
}


output "cognito_user_pool_client" {
  value = "${data.external.cognito_user_pool_client.result}"
}