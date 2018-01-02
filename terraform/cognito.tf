resource "aws_cognito_user_pool" "pool" {
  name = "Cancerbero"

  admin_create_user_config = {
    allow_admin_create_user_only = true
  }

  auto_verified_attributes = [
    "phone_number",
    "email"
  ]

  device_configuration = {
    challenge_required_on_new_device = false
    device_only_remembered_on_user_prompt = false
  }


  sms_configuration = {
    external_id = "${var.sms_external_id}"
    sns_caller_arn = "${aws_iam_role.cognito_sms.arn}"
  }

  username_attributes = [
    "phone_number",
    "email"
  ]

  schema = [
    {
      attribute_data_type = "String"
      mutable = true
      name = "given_name"
      required = true
    }
  ]

  mfa_configuration = "OPTIONAL"

  provisioner "local-exec" {
    command = <<EOF
aws cognito-idp create-user-pool-client \
  --user-pool-id ${aws_cognito_user_pool.pool.id} \
  --client-name CancerberoApp \
  --generate-secret
EOF
  }
}

resource "aws_iam_role" "cancerbero_admin" {
  name = "cancerbero_admin"
  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": [
        "sts:AssumeRole"
      ],
      "Principal": {
        "Service": "cognito-idp.amazonaws.com"
      },
      "Effect": "Allow",
      "Sid": ""
    }
  ]
}
EOF
}
resource "aws_iam_role" "cancerbero_user" {
  name = "cancerbero_user"
  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": [
        "sts:AssumeRole"
      ],
      "Principal": {
        "Service": "cognito-idp.amazonaws.com"
      },
      "Effect": "Allow",
      "Sid": ""
    }
  ]
}
EOF
}
