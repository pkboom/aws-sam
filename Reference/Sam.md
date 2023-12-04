# Deploy to different environments

```toml
version = 0.1

[qa.deploy.parameters]
stack_name = "my-qa-stack"
s3_bucket = "XXXXX-qa"
s3_prefix = "XXXXX/qa"
region = "eu-west-1"
capabilities = "CAPABILITY_IAM"
parameter_overrides = "Environment=qa"

[prod.deploy.parameters]
stack_name = "my-prod-stack"
s3_bucket = "XXXXX-prod"
s3_prefix = "XXXXX/prod"
region = "eu-west-1"
capabilities = "CAPABILITY_IAM"
parameter_overrides = "Environment=prod"
```

```sh
sam deploy --config-env <qa|prod>
```
