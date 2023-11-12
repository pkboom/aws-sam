# Install sam

```sh
brew install awscli
brew install aws-sam-cli

aws --version
sam --version
```

# Setup aws credentials

[Creating new access keys for an IAM user](https://docs.aws.amazon.com/keyspaces/latest/devguide/access.credentials.html#create.keypair)

[Set and view configuration settings using commands](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-files.html#cli-configure-files-methods)

Create credential

```sh
aws configure
```

```
# ~/.aws/credentials

[inbox_monster_dev]
aws_access_key_id = <access_key_id>
aws_secret_access_key = <secret_access_key>
```

List credentials

```sh
aws configure list

aws configure list --profile inbox_monster_dev
```

# Make profile default

```
# ~/.zshrc

export AWS_PROFILE=<profile-name>

e.g.
export AWS_PROFILE=inbox_monster_dev
```

# Query CloudFormation stack

```sh
aws cloudformation describe-stacks --query 'Stacks[].Outputs'
aws cloudformation describe-stacks --query 'Stacks[].Outputs[?OutputKey==`SqsLambdaSqs`]'
aws cloudformation describe-stacks --query 'Stacks[].Outputs[?OutputKey==`SqsLambdaSqs`].OutputValue[]'
```
