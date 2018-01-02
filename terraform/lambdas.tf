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
      SNS_ARN = "${aws_sns_topic.events.arn}"
      DB_ENDPOINT = "${aws_db_instance.domo.endpoint}"
      DB_USER = "${aws_db_instance.domo.username}"
      DB_PASSWORD = "${aws_db_instance.domo.password}"
      DB_DATABASE = "${aws_db_instance.domo.name}"
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

  environment {
    variables = {
      SNS_ARN = "${aws_sns_topic.events.arn}"
      DB_ENDPOINT = "${aws_db_instance.domo.endpoint}"
      DB_USER = "${aws_db_instance.domo.username}"
      DB_PASSWORD = "${aws_db_instance.domo.password}"
      DB_DATABASE = "${aws_db_instance.domo.name}"
    }
  }
}

resource "aws_lambda_function" "domo-slave-api-gateway-installations" {
  depends_on = ["aws_sns_topic.events"]
  filename         = "../lambda/domo-slave-api-gateway.zip"
  function_name    = "domo-slave-api-gateway-installation"
  role             = "${aws_iam_role.domo_slave_lambda.arn}"
  handler          = "installations.handler"
  source_code_hash = "${base64sha256(file("../lambda/domo-slave-api-gateway.zip"))}"
  runtime          = "nodejs6.10"

  environment {
    variables = {
      SNS_ARN = "${aws_sns_topic.events.arn}"
      DB_ENDPOINT = "${aws_db_instance.domo.endpoint}"
      DB_USER = "${aws_db_instance.domo.username}"
      DB_PASSWORD = "${aws_db_instance.domo.password}"
      DB_DATABASE = "${aws_db_instance.domo.name}"
    }
  }
}

resource "aws_lambda_function" "domo-slave-event-handler" {
  depends_on = ["aws_sns_topic.events"]
  filename         = "../lambda/domo-slave-event-handler.zip"
  function_name    = "domo-slave-event-handler"
  role             = "${aws_iam_role.domo_slave_lambda.arn}"
  handler          = "index.handler"
  source_code_hash = "${base64sha256(file("../lambda/domo-slave-event-handler.zip"))}"
  runtime          = "nodejs6.10"

  environment {
    variables = {
      DB_ENDPOINT = "${aws_db_instance.domo.endpoint}"
      DB_USER = "${aws_db_instance.domo.username}"
      DB_PASSWORD = "${aws_db_instance.domo.password}"
      DB_DATABASE = "${aws_db_instance.domo.name}"
    }
  }
}