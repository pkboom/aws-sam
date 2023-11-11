Create lambda

```sh
sam init --runtime nodejs18.x --name sqs-lambda-app
```

Deploy

```sh
sam validate
sam build
sam deploy -g
sam deploy --guided --profile inbox_monster_dev
```

Send a message to sqs

```sh
aws sqs send-message --queue-url "https://sqs.us-east-2.amazonaws.com/524978277775/sam-app-Lambda2Sqs-L4oXiYmo4QKb" --message-body "hello from sqs-lambda trigger" --profile inbox_monster_dev
```

Check logs

```sh
sam logs -n Lambda1
sam logs -n Lambda1 --profile inbox_monster_dev
```

https://engineering.surveysparrow.com/build-a-serverless-application-using-aws-lambda-api-gateway-sqs-and-deploy-using-aws-sam-be56a0617a30

https://medium.com/tuimm/using-aws-sam-to-build-and-deploy-an-application-with-sns-sqs-and-lambda-services-91e909b0f1d2
