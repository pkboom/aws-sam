# Install sam

```sh
brew install awscli
brew install aws-sam-cli

aws --version
sam --version
```

# Setup aws credentials

https://docs.aws.amazon.com/keyspaces/latest/devguide/access.credentials.html

https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-files.html#cli-configure-files-format-profile

https://docs.aws.amazon.com/sdkref/latest/guide/file-location.html

```
# ~/.aws/credentials

[inbox_monster_dev]
aws_access_key_id = <access_key_id>
aws_secret_access_key = <secret_access_key>
```

```sh
aws configure list --profile inbox_monster_dev
```

https://blog.appsignal.com/2022/03/23/build-serverless-apis-with-nodejs-and-aws-lambda.html

https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-getting-started-hello-world.html

https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/using-sam-cli-local-start-lambda.html

```sh
sam init --runtime nodejs18.x --name aws-lambda-nodejs-example
```

# SAM

### AWS::Serverless::Function

https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-resource-function.html

# Run lambda locally

Run docker

sam local start-api

curl http://localhost:3000/hello | jq

Test without makeing http request

sam local invoke "HelloWorldFunction" --event events/event.json

Deploying the Lambda Function

sam build
