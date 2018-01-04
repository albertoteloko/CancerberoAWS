resource "aws_dynamodb_table" "installations" {
  name           = "INSTALLATIONS"
  read_capacity  = 5
  write_capacity = 5
  hash_key       = "id"

  attribute {
    name = "id"
    type = "S"
  }
}

resource "aws_dynamodb_table" "nodes" {
  name           = "NODES"
  read_capacity  = 5
  write_capacity = 5
  hash_key       = "id"

  attribute {
    name = "id"
    type = "S"
  }
}

resource "aws_dynamodb_table" "events" {
  name           = "EVENTS"
  read_capacity  = 5
  write_capacity = 5
  hash_key       = "id"
  range_key      = "nodeId"

  attribute {
    name = "id"
    type = "S"
  }

  attribute {
    name = "nodeId"
    type = "S"
  }
}

