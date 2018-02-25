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

  stream_enabled = true
  stream_view_type = "NEW_AND_OLD_IMAGES"
}

resource "aws_lambda_event_source_mapping" "event_source_mapping" {
  batch_size        = 100
  event_source_arn  = "${aws_dynamodb_table.events.stream_arn}"
  enabled           = true
  function_name     = "${aws_lambda_function.domo-slave-event-handler.arn}"
  starting_position = "TRIM_HORIZON"
}


