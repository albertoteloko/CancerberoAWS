resource "aws_s3_bucket" "lambdas" {
  bucket = "cancerbero-lambdas-bucket"
  acl = "private"
}

resource "aws_s3_bucket_object" "api-gateway" {
  bucket = "${aws_s3_bucket.lambdas.id}"
  key = "api-gateway.zip-${base64sha256(file("../lambda/api-gateway/build/distributions/api-gateway.zip"))}"
  source = "../lambda/api-gateway/build/distributions/api-gateway.zip"
  etag = "${md5(file("../lambda/api-gateway/build/distributions/api-gateway.zip"))}"
}

resource "aws_lambda_function" "domo-slave-api-gateway-events" {
  depends_on = ["aws_sns_topic.events", "aws_s3_bucket_object.api-gateway"]
  function_name = "domo-slave-api-gateway-events"
  s3_bucket = "${aws_s3_bucket.lambdas.id}"
  s3_key = "api-gateway.zip-${base64sha256(file("../lambda/api-gateway/build/distributions/api-gateway.zip"))}"
  role = "${aws_iam_role.domo_slave_lambda.arn}"
  handler = "com.acs.cancerbero.lambda.Events::handleRequest"
  runtime = "java8"
  memory_size = 1024
  timeout = 10

  environment {
    variables = {
      SNS_ARN = "${aws_sns_topic.events.arn}"
    }
  }
}

resource "aws_lambda_function" "domo-slave-api-gateway-nodes" {
  depends_on = ["aws_sns_topic.events", "aws_s3_bucket_object.api-gateway"]
  function_name = "domo-slave-api-gateway-nodes"
  s3_bucket = "${aws_s3_bucket.lambdas.id}"
  s3_key = "api-gateway.zip"
  role = "${aws_iam_role.domo_slave_lambda.arn}"
  handler = "com.acs.cancerbero.lambda.Nodes::handleRequest"
  runtime = "java8"
  memory_size = 1024
  timeout = 10

  environment {
    variables = {
      SNS_ARN = "${aws_sns_topic.events.arn}"
    }
  }
}

resource "aws_lambda_function" "domo-slave-api-gateway-installations" {
  depends_on = ["aws_sns_topic.events", "aws_s3_bucket_object.api-gateway"]
  function_name = "domo-slave-api-gateway-installation"
  s3_bucket = "${aws_s3_bucket.lambdas.id}"
  s3_key = "api-gateway.zip"
  role = "${aws_iam_role.domo_slave_lambda.arn}"
  handler = "com.acs.cancerbero.lambda.Installation::handleRequest"
  runtime = "java8"
  memory_size = 1024
  timeout = 10

  environment {
    variables = {
      SNS_ARN = "${aws_sns_topic.events.arn}"
    }
  }
}