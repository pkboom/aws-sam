sam init --runtime nodejs18.x --name sqs-lambda

cd sqs-lambda

mv hello-world src

cd src

npm i

sam validate

sam build

sam deploy -g

No prompt
sam deploy --no-confirm-changeset

aws sqs send-message --queue-url "https://sqs.us-east-2.amazonaws.com/524978277775/sqs-lambda-SqsLambdaSqs-EXS07lKkqHWL" --message-body "hello from sqs-lambda trigger"

sam logs -n SqsLambdaFunction --tail
sam logs --name SqsLambdaFunction

sam logs -n SqsLambdaFunction --stack-name myStack --tail
