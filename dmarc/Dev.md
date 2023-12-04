```sh
sam deploy --template-file template.yaml --stack-name dmarc --capabilities CAPABILITY_IAM CAPABILITY_AUTO_EXPAND

sam build
sam deploy
sam build && sam deploy
sam deploy -g --capabilities CAPABILITY_IAM CAPABILITY_AUTO_EXPAND
sam build && sam deploy --capabilities CAPABILITY_IAM CAPABILITY_AUTO_EXPAND
sam build && sam deploy --parameter-overrides 'RecordQueueArn=arn:aws:sqs:us-east-2:524978277775:dmarc-processing-CreateRecords-8ER1NO2K15T9-RecordQueue-pHvsnqBCOtLK RecordBucketName=dmarc-processing-createrecords-8er1n-recordbucket-xk3ctgmi67ms'
sam sync --watch --parameter-overrides 'RecordQueueArn=arn:aws:sqs:us-east-2:524978277775:dmarc-processing-CreateRecords-8ER1NO2K15T9-RecordQueue-pHvsnqBCOtLK RecordBucketName=dmarc-processing-createrecords-8er1n-recordbucket-xk3ctgmi67ms'

sam delete --no-prompts

sam local generate-event sqs receive-message --body '{\"foo\": \"bar\"}' > events/google.json

sam local generate-event sqs receive-message --body google.eml > events/google.json
sam local generate-event sqs receive-message --body whisnantstrategies.eml > events/whisnantstrategies.json

sam sync --watch

sam logs --tail

sam local invoke --event events/google.json
sam local invoke --event events/whisnantstrategies.json

sam remote invoke
sam remote invoke --event-file events/google.json
```
