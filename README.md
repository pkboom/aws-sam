# Install sam

```sh
brew install awscli
brew install aws-sam-cli

aws --version
sam --version
```

# Setup aws credentials

(Creating new access keys for an IAM user)[https://docs.aws.amazon.com/keyspaces/latest/devguide/access.credentials.html#create.keypair]

(Set and view configuration settings using commands)[https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-files.html#cli-configure-files-methods]

```sh
aws configure
```

```
# ~/.aws/credentials

[inbox_monster_dev]
aws_access_key_id = <access_key_id>
aws_secret_access_key = <secret_access_key>
```

```sh
aws configure list

aws configure list --profile inbox_monster_dev
```

# Create Lambda Function

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

https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-getting-started-hello-world.html

https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/using-sam-cli-local-start-lambda.html

# SAM

### AWS::Serverless::Function

https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-resource-function.html
