resource "aws_lambda_function" "domo-slave-api-gateway-events" {
  depends_on = ["aws_sns_topic.events"]
  filename         = "../lambda/domo-slave-api-gateway.zip"
  function_name    = "domo-slave-api-gateway-events"
  role             = "${aws_iam_role.domo_slave_lambda.arn}"
  handler          = "events.handler"
  source_code_hash = "${base64sha256(file("../lambda/domo-slave-api-gateway.zip"))}"
  runtime          = "nodejs6.10"

  environment {
    variables = {
      SNS_ARN = "${aws_sns_topic.events.arn}",
      ACCOUNT_ID = "${var.account_id}"
    }
  }
}

resource "aws_lambda_function" "domo-slave-api-gateway-nodes" {
  depends_on = ["aws_sns_topic.events"]
  filename         = "../lambda/domo-slave-api-gateway.zip"
  function_name    = "domo-slave-api-gateway-nodes"
  role             = "${aws_iam_role.domo_slave_lambda.arn}"
  handler          = "nodes.handler"
  source_code_hash = "${base64sha256(file("../lambda/domo-slave-api-gateway.zip"))}"
  runtime          = "nodejs6.10"
  timeout          = 5

  environment {
    variables = {
      SNS_ARN = "${aws_sns_topic.events.arn}",
      PARTICLE_API_USER = "${var.particle_api_user}",
      PARTICLE_API_PASSWORD = "${var.particle_api_password}"
    }
  }
}

resource "aws_lambda_function" "domo-slave-event-handler" {
  depends_on = ["aws_sns_topic.events"]
  filename         = "../lambda/domo-slave-event-handler.zip"
  function_name    = "domo-slave-api-event-handler"
  role             = "${aws_iam_role.domo_slave_lambda.arn}"
  handler          = "index.handler"
  source_code_hash = "${base64sha256(file("../lambda/domo-slave-event-handler.zip"))}"
  runtime          = "nodejs6.10"

  environment {
    variables = {
      SNS_ARN = "${aws_sns_topic.events.arn}",
      ACCOUNT_ID = "${var.account_id}"
      POOL_ID = "${aws_cognito_user_pool.cancerbero.id}"
    }
  }
}