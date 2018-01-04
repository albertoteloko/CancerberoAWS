resource "aws_dynamodb_table" "installations" {
  name           = "INSTALLATIONS"
  read_capacity  = 5
  write_capacity = 5
  hash_key       = "Id"

  attribute {
    name = "Id"
    type = "S"
  }
}

resource "aws_dynamodb_table" "events" {
  name           = "EVENT"
  read_capacity  = 5
  write_capacity = 5
  hash_key       = "Id"
  range_key      = "NodeId"

  attribute {
    name = "Id"
    type = "S"
  }

  attribute {
    name = "NodeId"
    type = "S"
  }
}

