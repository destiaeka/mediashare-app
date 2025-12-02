resource "aws_db_subnet_group" "rds_sg" {
  name       = "rds_sg"
  subnet_ids = [aws_subnet.priv_a.id, aws_subnet.priv_b.id]

  tags = {
    Name = "rds_sg"
  }
}

resource "aws_db_instance" "finalproject" {
  allocated_storage    = 20
  db_name              = "mediashare"
  engine               = "mysql"
  engine_version       = "8.0"
  instance_class       = "db.t3.micro"

  username             = "admin"
  password             = "ndoroayudestiaeka"

  publicly_accessible = false
  skip_final_snapshot = true

  db_subnet_group_name = aws_db_subnet_group.rds_sg.name
  vpc_security_group_ids = [
    aws_security_group.sg_global.id
  ]

  tags = {
    Name = "mediashare-db"
  }
}
