resource "aws_db_instance" "domo" {
  identifier = "domo"
  allocated_storage = 50
  storage_type = "gp2"
  engine = "postgres"
  engine_version = "9.6.3"
  instance_class = "db.t2.micro"
  name = "domo"
  username = "${var.db_admin_user}"
  password = "${var.db_admin_password}"
  publicly_accessible = true
  skip_final_snapshot = true
}


output "db_endpoint" {
  value = "${aws_db_instance.domo.endpoint}"
}