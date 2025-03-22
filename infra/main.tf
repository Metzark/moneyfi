provider "aws" {
  region = "us-east-2"
}

resource "aws_lightsail_instance" "moneyfi-nextjs" {
  name              = "moneyfi-1"
  availability_zone = "us-east-2a"
  blueprint_id      = "ubuntu_20_04"
  bundle_id         = "nano_2_0"
  key_pair_name     = "moneyfi"

  tags = {
  }
}