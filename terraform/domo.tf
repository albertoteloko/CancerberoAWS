provider "aws" {
  access_key = "${var.access_key}"
  secret_key = "${var.secret_key}"
  region     = "${var.region}"
}

//resource "aws_instance" "example" {
//  key_name      = "tester"
//  ami           = "ami-bf2ba8d0"
//  instance_type = "t2.micro"
//}
