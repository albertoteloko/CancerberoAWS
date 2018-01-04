resource "aws_s3_bucket" "lambdas" {
  bucket = "cancerbero-lambdas-bucket"
  acl    = "private"
}

resource "aws_s3_bucket_object" "api-gateway" {
  bucket = "${aws_s3_bucket.lambdas.id}"
  key    = "api-gateway.zip"
  source = "../lambda/api-gateway/build/distributions/api-gateway.zip"
  etag   = "${md5(file("../lambda/api-gateway/build/distributions/api-gateway.zip"))}"
}
//
//resource "aws_lambda_function" "domo-slave-api-gateway-events" {
//  depends_on = ["aws_sns_topic.events", "aws_s3_bucket_object.api-gateway"]
//  function_name = "domo-slave-api-gateway-events"
////  filename = "../lambda/api-gateway/build/distributions/api-gateway.zip"
////  source_code_hash = "${base64sha256(file("../lambda/api-gateway/build/distributions/api-gateway.zip"))}"
//  s3_bucket = "${aws_s3_bucket.lambdas.id}"
//  s3_key = "api-gateway.zip.${base64sha256(file("../lambda/api-gateway/build/distributions/api-gateway.zip"))}"
//  role = "${aws_iam_role.domo_slave_lambda.arn}"
//  handler = "com.acs.cancerbero.lambda.Events::handleRequest"
//  runtime = "java8",
//  memory_size = 512
//
//  environment {
//    variables = {
//      SNS_ARN = "${aws_sns_topic.events.arn}"
//      //      DB_ENDPOINT = "${aws_db_instance.domo.endpoint}"
//      //      DB_USER = "${aws_db_instance.domo.username}"
//      //      DB_PASSWORD = "${aws_db_instance.domo.password}"
//      //      DB_DATABASE = "${aws_db_instance.domo.name}"
//    }
//  }
//}


resource "aws_lambda_function" "domo-slave-api-gateway-events" {
  depends_on = ["aws_sns_topic.events"]
  function_name = "domo-slave-api-gateway-events"
  filename = "../lambda/api-gateway/build/distributions/api-gateway.zip"
  source_code_hash = "${base64sha256(file("../lambda/api-gateway/build/distributions/api-gateway.zip"))}"
  role = "${aws_iam_role.domo_slave_lambda.arn}"
  handler = "com.acs.cancerbero.lambda.Events::handleRequest"
  runtime = "java8"
  memory_size = 1024
  timeout = 5

  environment {
    variables = {
      SNS_ARN = "${aws_sns_topic.events.arn}"
      //      DB_ENDPOINT = "${aws_db_instance.domo.endpoint}"
      //      DB_USER = "${aws_db_instance.domo.username}"
      //      DB_PASSWORD = "${aws_db_instance.domo.password}"
      //      DB_DATABASE = "${aws_db_instance.domo.name}"
    }
  }
}

resource "aws_lambda_function" "domo-slave-api-gateway-nodes" {
  depends_on = [
    "aws_sns_topic.events"]
  function_name = "domo-slave-api-gateway-nodes"
  filename = "../lambda/api-gateway/build/distributions/api-gateway.zip"
  role = "${aws_iam_role.domo_slave_lambda.arn}"
  handler = "com.acs.cancerbero.lambda.Nodes::handleRequest"
  source_code_hash = "${base64sha256(file("../lambda/api-gateway/build/distributions/api-gateway.zip"))}"
  runtime = "java8"

  environment {
    variables = {
      SNS_ARN = "${aws_sns_topic.events.arn}"
      //      DB_ENDPOINT = "${aws_db_instance.domo.endpoint}"
      //      DB_USER = "${aws_db_instance.domo.username}"
      //      DB_PASSWORD = "${aws_db_instance.domo.password}"
      //      DB_DATABASE = "${aws_db_instance.domo.name}"
    }
  }
}

resource "aws_lambda_function" "domo-slave-api-gateway-installations" {
  depends_on = [
    "aws_sns_topic.events"]
  function_name = "domo-slave-api-gateway-installation"
  filename = "../lambda/api-gateway/build/distributions/api-gateway.zip"
  role = "${aws_iam_role.domo_slave_lambda.arn}"
  handler = "com.acs.cancerbero.lambda.Installation::handleRequest"
  source_code_hash = "${base64sha256(file("../lambda/api-gateway/build/distributions/api-gateway.zip"))}"
  runtime = "java8"

  environment {
    variables = {
      SNS_ARN = "${aws_sns_topic.events.arn}"
      //      DB_ENDPOINT = "${aws_db_instance.domo.endpoint}"
      //      DB_USER = "${aws_db_instance.domo.username}"
      //      DB_PASSWORD = "${aws_db_instance.domo.password}"
      //      DB_DATABASE = "${aws_db_instance.domo.name}"
    }
  }
}
//
//resource "aws_lambda_function" "domo-slave-event-handler" {
//  depends_on = ["aws_sns_topic.events"]
//  function_name    = "domo-slave-event-handler"
//  filename         = "../lambda/domo-slave-event-handler.zip"
//  role             = "${aws_iam_role.domo_slave_lambda.arn}"
//  handler          = "index.handler"
//  source_code_hash = "${base64sha256(file("../lambda/domo-slave-event-handler.zip"))}"
//  runtime          = "nodejs6.10"
//
////  environment {
////    variables = {
////      DB_ENDPOINT = "${aws_db_instance.domo.endpoint}"
////      DB_USER = "${aws_db_instance.domo.username}"
////      DB_PASSWORD = "${aws_db_instance.domo.password}"
////      DB_DATABASE = "${aws_db_instance.domo.name}"
////    }
////  }
//}