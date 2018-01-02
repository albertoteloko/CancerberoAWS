resource "aws_sns_topic" "events" {
  name = "domo-slave-events"
}

resource "aws_sns_topic_policy" "default" {
  arn = "${aws_sns_topic.events.arn}"

  policy = "${data.aws_iam_policy_document.sns-topic-policy.json}"
}

data "aws_iam_policy_document" "sns-topic-policy" {
  policy_id = "sns-events-topic"

  statement {
    sid = "sns-events-topic-publish"
    actions = [
      "SNS:Subscribe",
      "SNS:SetTopicAttributes",
      "SNS:RemovePermission",
      "SNS:Receive",
      "SNS:Publish",
      "SNS:ListSubscriptionsByTopic",
      "SNS:GetTopicAttributes",
      "SNS:DeleteTopic",
      "SNS:AddPermission",
    ]

    condition {
      test = "StringEquals"
      variable = "AWS:SourceAccount"

      values = [
        "${var.account_id}",
      ]
    }

    effect = "Allow"

    principals {
      type = "AWS"
      identifiers = [
        "*"]
    }

    resources = [
      "${aws_sns_topic.events.arn}",
    ]
  }
}


//resource "aws_sns_topic_subscription" "topic_lambda" {
//  topic_arn = "${aws_sns_topic.events.arn}"
//  protocol  = "lambda"
//  endpoint  = "${aws_lambda_function.domo-slave-event-handler.arn}"
//}
//
//resource "aws_lambda_permission" "with_sns" {
//  statement_id = "AllowExecutionFromSNS"
//  action = "lambda:InvokeFunction"
//  function_name = "${aws_lambda_function.domo-slave-event-handler.arn}"
//  principal = "sns.amazonaws.com"
//  source_arn = "${aws_sns_topic.events.arn}"
//}