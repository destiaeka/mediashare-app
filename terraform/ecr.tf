resource "aws_ecr_repository" "finalproject" {
  name                 = "finalproject"
  image_tag_mutability = "MUTABLE"

  image_scanning_configuration {
    scan_on_push = false
  }
}
