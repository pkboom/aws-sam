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

# Create Lambda Function

https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-getting-started-hello-world.html#serverless-getting-started-hello-world-init

```sh
sam init --runtime nodejs18.x --name aws-lambda-nodejs-example
```

```
Which template source would you like to use?
	1 - AWS Quick Start Templates
	2 - Custom Template Location
Choice: 1

Choose an AWS Quick Start application template
	1 - Hello World Example
	2 - Hello World Example with Powertools for AWS Lambda
	3 - Multi-step workflow
	4 - Standalone function
	5 - Scheduled task
	6 - Data processing
	7 - Serverless API
	8 - Full Stack
	9 - Lambda Response Streaming
Template: 1

Based on your selections, the only Package type available is Zip.
We will proceed to selecting the Package type as Zip.

Based on your selections, the only dependency manager available is npm.
We will proceed copying the template using npm.

Select your starter template
	1 - Hello World Example
	2 - Hello World Example TypeScript
Template: 1

Would you like to enable X-Ray tracing on the function(s) in your application?  [y/N]: N

Would you like to enable monitoring using CloudWatch Application Insights?
For more info, please view https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/cloudwatch-application-insights.html [y/N]: N
```

# Local test

https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/using-sam-cli-local.html

> Run docker first.

Invoke serverless application.

```sh
sam local invoke HelloWorldFunction

sam local invoke HelloWorldFunction | jq

sam local invoke HelloWorldFunction --event events/event.json
```

Emulate your application's API locally on port 3000.

> Run docker first.

```bash
sam local start-api

e.g.
curl http://localhost:3000/hello
```

# Deploy

```bash
sam validate
sam build
sam deploy -g --no-confirm-changeset --capabilities CAPABILITY_IAM

sam validate --template template.yaml
sam deploy --guided
sam deploy --guided --profile inbox_monster_dev
sam deploy --template-file packaged.yaml --stack-name HelloWorld
```

> Hit api endpoint: curl https://<API_ID>.execute-api.<AWS_REGION>.amazonaws.com/Prod/hello

## Prompt

```
# Shows you resources changes to be deployed and require a 'Y' to initiate deploy
Confirm changes before deploy [Y/n]: n

# API Gateway endpoint is configured to be publicly accessible, without authorization.
HelloWorldFunction has no authentication. Is this okay? [y/N]: y
```

## Display output

```sh
sam list stack-outputs

# api endpoints
sam list endpoints
sam list endpoints --output json
```

# Log

https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-logging.html

> This command works for all AWS Lambda functions; not just the ones you deploy using SAM.

```bash
sam logs -n HelloWorldFunction --stack-name aws-lambda-nodejs-example --tail
```

# Unit tests

```bash
npm run test
```

# Delete

```bash
sam delete

sam delete --stack-name aws-lambda-nodejs-example
```

# Query CloudFormation stack

```sh
aws cloudformation describe-stacks --query 'Stacks[].Outputs'

# query outputkey=SqsLambdaSqs
aws cloudformation describe-stacks --query 'Stacks[].Outputs[?OutputKey==`SqsLambdaSqs`]'

aws cloudformation describe-stacks --query 'Stacks[].Outputs[?OutputKey==`SqsLambdaSqs`].OutputValue[]'
```
