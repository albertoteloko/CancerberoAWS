resource "aws_api_gateway_rest_api" "domo-slave-api" {
  name        = "Domo Slave API"
  description = "API used by all slaves nodes"
}

resource "aws_api_gateway_deployment" "dev" {
  depends_on = [
    "aws_api_gateway_method.events",
    "aws_api_gateway_method.installations",
    "aws_api_gateway_method.installation",
    "aws_api_gateway_method.nodes",
    "aws_api_gateway_method.node-action",
    "aws_api_gateway_method.node",
    "aws_api_gateway_integration.events",
    "aws_api_gateway_integration.installation",
    "aws_api_gateway_integration.installations",
    "aws_api_gateway_integration.node-read",
    "aws_api_gateway_integration.nodes-find",
    "aws_cloudformation_stack.cancerbero_api_authorizer"
  ]
  rest_api_id = "${aws_api_gateway_rest_api.domo-slave-api.id}"
  stage_name = "dev"
}

resource "aws_api_gateway_deployment" "prod" {
  depends_on = [
    "aws_api_gateway_method.events",
    "aws_api_gateway_method.installations",
    "aws_api_gateway_method.installation",
    "aws_api_gateway_method.nodes",
    "aws_api_gateway_method.node-action",
    "aws_api_gateway_method.node",
    "aws_api_gateway_integration.events",
    "aws_api_gateway_integration.installation",
    "aws_api_gateway_integration.installations",
    "aws_api_gateway_integration.node-read",
    "aws_api_gateway_integration.nodes-find",
    "aws_cloudformation_stack.cancerbero_api_authorizer"
  ]
  rest_api_id = "${aws_api_gateway_rest_api.domo-slave-api.id}"
  stage_name = "prod"
}

resource "aws_api_gateway_usage_plan" "domo-slave-api-usage-plan" {
  name         = "domo-slave-api-usage-plan"

  api_stages {
    api_id = "${aws_api_gateway_rest_api.domo-slave-api.id}"
    stage  = "${aws_api_gateway_deployment.dev.stage_name}"
  }

  api_stages {
    api_id = "${aws_api_gateway_rest_api.domo-slave-api.id}"
    stage  = "${aws_api_gateway_deployment.prod.stage_name}"
  }

  quota_settings {
    limit  = 100000
    period = "DAY"
  }

  throttle_settings {
    burst_limit = 10
    rate_limit  = 20
  }
}

resource "aws_api_gateway_api_key" "prod" {
  name = "domo-slave-api-prod"
}

resource "aws_api_gateway_api_key" "dev" {
  name = "domo-slave-api-dev"
}

resource "aws_api_gateway_usage_plan_key" "prod" {
  key_id        = "${aws_api_gateway_api_key.prod.id}"
  key_type      = "API_KEY"
  usage_plan_id = "${aws_api_gateway_usage_plan.domo-slave-api-usage-plan.id}"
}

resource "aws_api_gateway_usage_plan_key" "dev" {
  key_id        = "${aws_api_gateway_api_key.dev.id}"
  key_type      = "API_KEY"
  usage_plan_id = "${aws_api_gateway_usage_plan.domo-slave-api-usage-plan.id}"
}

resource "aws_api_gateway_resource" "events" {
  rest_api_id = "${aws_api_gateway_rest_api.domo-slave-api.id}"
  parent_id   = "${aws_api_gateway_rest_api.domo-slave-api.root_resource_id}"
  path_part   = "events"
}

resource "aws_api_gateway_resource" "installations" {
  rest_api_id = "${aws_api_gateway_rest_api.domo-slave-api.id}"
  parent_id   = "${aws_api_gateway_rest_api.domo-slave-api.root_resource_id}"
  path_part   = "installations"
}

resource "aws_api_gateway_resource" "installation" {
  rest_api_id = "${aws_api_gateway_rest_api.domo-slave-api.id}"
  parent_id   = "${aws_api_gateway_resource.installations.id}"
  path_part   = "{id}"
}

resource "aws_api_gateway_resource" "nodes" {
  rest_api_id = "${aws_api_gateway_rest_api.domo-slave-api.id}"
  parent_id   = "${aws_api_gateway_rest_api.domo-slave-api.root_resource_id}"
  path_part   = "nodes"
}

resource "aws_api_gateway_resource" "node" {
  rest_api_id = "${aws_api_gateway_rest_api.domo-slave-api.id}"
  parent_id   = "${aws_api_gateway_resource.nodes.id}"
  path_part   = "{id}"
}

resource "aws_api_gateway_resource" "node-action" {
  rest_api_id = "${aws_api_gateway_rest_api.domo-slave-api.id}"
  parent_id   = "${aws_api_gateway_resource.node.id}"
  path_part   = "actions"
}

resource "aws_api_gateway_method" "events" {
  rest_api_id   = "${aws_api_gateway_rest_api.domo-slave-api.id}"
  resource_id   = "${aws_api_gateway_resource.events.id}"
  http_method   = "POST"
  authorization = "NONE"
  api_key_required = true
}

resource "aws_api_gateway_method" "nodes" {
  rest_api_id   = "${aws_api_gateway_rest_api.domo-slave-api.id}"
  resource_id   = "${aws_api_gateway_resource.nodes.id}"
  http_method   = "GET"
  authorization = "COGNITO_USER_POOLS"
  authorizer_id = "${aws_cloudformation_stack.cancerbero_api_authorizer.outputs["id"]}"
  api_key_required = false
}

resource "aws_api_gateway_method" "node" {
  rest_api_id   = "${aws_api_gateway_rest_api.domo-slave-api.id}"
  resource_id   = "${aws_api_gateway_resource.node.id}"
  http_method   = "GET"
  authorization = "COGNITO_USER_POOLS"
  authorizer_id = "${aws_cloudformation_stack.cancerbero_api_authorizer.outputs["id"]}"
  api_key_required = false
}

resource "aws_api_gateway_method" "node-action" {
  rest_api_id   = "${aws_api_gateway_rest_api.domo-slave-api.id}"
  resource_id   = "${aws_api_gateway_resource.node-action.id}"
  http_method   = "POST"
  authorization = "COGNITO_USER_POOLS"
  authorizer_id = "${aws_cloudformation_stack.cancerbero_api_authorizer.outputs["id"]}"
  api_key_required = false
}

resource "aws_api_gateway_method" "installations" {
  rest_api_id   = "${aws_api_gateway_rest_api.domo-slave-api.id}"
  resource_id   = "${aws_api_gateway_resource.installations.id}"
  http_method   = "GET"
  authorization = "COGNITO_USER_POOLS"
  authorizer_id = "${aws_cloudformation_stack.cancerbero_api_authorizer.outputs["id"]}"
  api_key_required = false
}

resource "aws_api_gateway_method" "installation" {
  rest_api_id   = "${aws_api_gateway_rest_api.domo-slave-api.id}"
  resource_id   = "${aws_api_gateway_resource.installation.id}"
  http_method   = "GET"
  authorization = "COGNITO_USER_POOLS"
  authorizer_id = "${aws_cloudformation_stack.cancerbero_api_authorizer.outputs["id"]}"
  api_key_required = false
}

resource "aws_api_gateway_integration" "installations" {
  rest_api_id             = "${aws_api_gateway_rest_api.domo-slave-api.id}"
  resource_id             = "${aws_api_gateway_resource.installations.id}"
  http_method             = "${aws_api_gateway_method.installations.http_method}"
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = "arn:aws:apigateway:${var.region}:lambda:path/2015-03-31/functions/${aws_lambda_function.domo-slave-api-gateway-installations.arn}/invocations"
}

resource "aws_api_gateway_integration" "installation" {
  rest_api_id             = "${aws_api_gateway_rest_api.domo-slave-api.id}"
  resource_id             = "${aws_api_gateway_resource.installation.id}"
  http_method             = "${aws_api_gateway_method.installation.http_method}"
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = "arn:aws:apigateway:${var.region}:lambda:path/2015-03-31/functions/${aws_lambda_function.domo-slave-api-gateway-installations.arn}/invocations"
}

resource "aws_api_gateway_integration" "events" {
  rest_api_id             = "${aws_api_gateway_rest_api.domo-slave-api.id}"
  resource_id             = "${aws_api_gateway_resource.events.id}"
  http_method             = "${aws_api_gateway_method.events.http_method}"
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = "arn:aws:apigateway:${var.region}:lambda:path/2015-03-31/functions/${aws_lambda_function.domo-slave-api-gateway-events.arn}/invocations"
}

resource "aws_api_gateway_integration" "nodes-find" {
  rest_api_id             = "${aws_api_gateway_rest_api.domo-slave-api.id}"
  resource_id             = "${aws_api_gateway_resource.nodes.id}"
  http_method             = "${aws_api_gateway_method.nodes.http_method}"
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = "arn:aws:apigateway:${var.region}:lambda:path/2015-03-31/functions/${aws_lambda_function.domo-slave-api-gateway-nodes.arn}/invocations"
}

resource "aws_api_gateway_integration" "node-read" {
  rest_api_id             = "${aws_api_gateway_rest_api.domo-slave-api.id}"
  resource_id             = "${aws_api_gateway_resource.node.id}"
  http_method             = "${aws_api_gateway_method.node.http_method}"
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = "arn:aws:apigateway:${var.region}:lambda:path/2015-03-31/functions/${aws_lambda_function.domo-slave-api-gateway-nodes.arn}/invocations"
}

resource "aws_api_gateway_integration" "node-action" {
  rest_api_id             = "${aws_api_gateway_rest_api.domo-slave-api.id}"
  resource_id             = "${aws_api_gateway_resource.node-action.id}"
  http_method             = "${aws_api_gateway_method.node-action.http_method}"
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = "arn:aws:apigateway:${var.region}:lambda:path/2015-03-31/functions/${aws_lambda_function.domo-slave-api-gateway-nodes.arn}/invocations"
}

# Lambda
resource "aws_lambda_permission" "nodes" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = "${aws_lambda_function.domo-slave-api-gateway-nodes.arn}"
  principal     = "apigateway.amazonaws.com"
  source_arn = "arn:aws:execute-api:${var.region}:${var.account_id}:${aws_api_gateway_rest_api.domo-slave-api.id}/*/*"
}

resource "aws_lambda_permission" "events" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = "${aws_lambda_function.domo-slave-api-gateway-events.arn}"
  principal     = "apigateway.amazonaws.com"
  source_arn = "arn:aws:execute-api:${var.region}:${var.account_id}:${aws_api_gateway_rest_api.domo-slave-api.id}/*/*"
}

resource "aws_lambda_permission" "installations" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = "${aws_lambda_function.domo-slave-api-gateway-installations.arn}"
  principal     = "apigateway.amazonaws.com"
  source_arn = "arn:aws:execute-api:${var.region}:${var.account_id}:${aws_api_gateway_rest_api.domo-slave-api.id}/*/*"
}


output "dev_url" {
  value = "https://${aws_api_gateway_deployment.dev.rest_api_id}.execute-api.${var.region}.amazonaws.com/${aws_api_gateway_deployment.dev.stage_name}"
}

output "dev_key" {
  value = "${aws_api_gateway_api_key.dev.value}"
}

output "prod_url" {
  value = "https://${aws_api_gateway_deployment.prod.rest_api_id}.execute-api.${var.region}.amazonaws.com/${aws_api_gateway_deployment.prod.stage_name}"
}

output "prod_key" {
  value = "${aws_api_gateway_api_key.prod.value}"
}