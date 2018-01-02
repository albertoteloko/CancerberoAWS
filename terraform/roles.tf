resource "aws_iam_role" "domo_slave_lambda" {
  name = "domo_slave_lambda"

  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": [
        "sts:AssumeRole"
      ],
      "Principal": {
        "Service": "lambda.amazonaws.com"
      },
      "Effect": "Allow",
      "Sid": ""
    }
  ]
}
EOF
}

resource "aws_iam_role_policy" "domo_slave_lambda_policy" {
  name = "domo_slave_lambda_policy"
  role = "${aws_iam_role.domo_slave_lambda.id}"

  policy = <<EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "VisualEditor0",
            "Effect": "Allow",
            "Action": "sns:Publish",
            "Resource": "*"
        },
        {
            "Effect": "Allow",
            "Action": [
                "logs:CreateLogGroup",
                "logs:CreateLogStream",
                "logs:PutLogEvents"
            ],
            "Resource": "*"
        },
        {
            "Sid": "VisualEditor1",
            "Effect": "Allow",
            "Action": [
                "dynamodb:Scan",
                "dynamodb:Query",
                "dynamodb:DescribeTable",
                "dynamodb:GetItem",
                "dynamodb:PutItem",
                "dynamodb:UpdateItem",
                "dynamodb:DeleteItem"
            ],
            "Resource": "*"
        }
    ]
}
EOF
}
//
//{
//  "Effect": "Allow",
//"Action": [
//"logs:CreateLogGroup",
//"logs:CreateLogStream",
//"logs:PutLogEvents"
//],
//"Resource": "arn:aws:logs:*:*:*"
//},
//{
//"Effect": "Allow",
//"Action": [
//"lambda:InvokeFunction"
//],
//"Resource": "arn:aws:lambda:*:*:*"
//},
//{
//"Effect": "Allow",
//"Action": [
//"dynamodb:GetItem"
//],
//"Resource": "arn:aws:dynamodb:*:*:*"
//}