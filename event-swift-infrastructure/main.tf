terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "5.67.0"
    }
  }
}

provider "aws" {
  region = "eu-west-2" 
}

resource "aws_cognito_user_pool" "eventswift_pool" {
  name = "EventswiftUserPool"

  username_attributes      = ["email"]
  auto_verified_attributes = ["email"]

  username_configuration {
    case_sensitive = false
  }

  schema {
    name                = "profile"
    attribute_data_type = "String"
    mutable             = false
    required            = true

    string_attribute_constraints {
      min_length = 1
      max_length = 256
    }
  }

  password_policy {
    minimum_length    = 8
    require_lowercase = true
    require_numbers   = true
    require_symbols   = true
    require_uppercase = true
  }

  account_recovery_setting {
    recovery_mechanism {
      name     = "verified_email"
      priority = 1
    }
  }

  mfa_configuration = "OPTIONAL"
  
  software_token_mfa_configuration {
    enabled = true
  }
}

resource "aws_cognito_user_pool_client" "eventswift_client" {
  name         = "eventswift-client"
  user_pool_id = aws_cognito_user_pool.eventswift_pool.id

  generate_secret                      = true
  prevent_user_existence_errors        = "ENABLED"
  explicit_auth_flows                  = ["ALLOW_USER_PASSWORD_AUTH", "ALLOW_REFRESH_TOKEN_AUTH"]
  allowed_oauth_flows_user_pool_client = true
  allowed_oauth_flows                  = ["code", "implicit"]
  allowed_oauth_scopes                 = ["email", "openid", "profile"]
  callback_urls                        = ["http://localhost:3000/callback"] # Replace with your actual callback URL
}

output "cognito_user_pool_id" {
  value = aws_cognito_user_pool.eventswift_pool.id
}

output "cognito_client_id" {
  value = aws_cognito_user_pool_client.eventswift_client.id
}

output "cognito_client_secret" {
  value     = aws_cognito_user_pool_client.eventswift_client.client_secret
  sensitive = true
}
