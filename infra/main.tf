provider "aws" {
  region = "us-east-2"
}

resource "aws_lightsail_instance" "moneyfi" {
  name              = "moneyfi"
  availability_zone = "us-east-2a"
  blueprint_id      = "ubuntu_20_04"
  bundle_id         = "nano_2_0"
  key_pair_name     = "moneyfi-us-east-2"

  tags = {
    Name = "moneyfi"
  }
}