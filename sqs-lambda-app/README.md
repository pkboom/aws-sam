sam init --runtime nodejs18.x --name sqs-lambda-app

Send a message to lambda-test queue that we just created with the AWS SAM template.

aws sqs send-message --queue-url "https://sqs.eu-west-1.amazonaws.com/xxxxxx/lambda-test" --message-body "hello from sqs-lambda trigger"

Check logs

sam logs -n SQSPayloadLogger

https://engineering.surveysparrow.com/build-a-serverless-application-using-aws-lambda-api-gateway-sqs-and-deploy-using-aws-sam-be56a0617a30

https://medium.com/tuimm/using-aws-sam-to-build-and-deploy-an-application-with-sns-sqs-and-lambda-services-91e909b0f1d2
