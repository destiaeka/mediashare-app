resource "aws_s3_bucket" "finalproject" {
  bucket = "mediashare-app-destia"

  tags = {
    Name        = "mediashare-app"
  }
}
