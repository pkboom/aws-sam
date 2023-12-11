# [ElastiCache Node Types](https://www.dragonflydb.io/guides/elasticache-node-instance-types)

# [Supported node types](https://docs.aws.amazon.com/AmazonElastiCache/latest/red-ug/CacheNodes.SupportedTypes.html#CacheNodes.SupportedTypesByRegion)

sam build && sam deploy --config-env prod --parameter-overrides 'Env=prod'

sam sync --watch --config-env prod

# Error

## Kiness

### ProvisionedThroughputExceededException

Too many write requests in a second.

## CloudFormation

### Circular dependency errors

A circular dependency means that two resources are dependent on each other or that a resource is dependent on itself.
AWS CloudFormation is unable to clearly determine which resource should be created first.

### UPDATE_ROLLBACK_FAILED

https://repost.aws/knowledge-center/cloudformation-update-rollback-failed

See the root cause on CloudFormation console.

### ROLLBACK_COMPLETE state and can not be updated

Stack creation fails. It's successfully rolled back (deleted) all the resources which the stack had created. The only thing remaining is the empty stack itself. You cannot update this stack; you must manually delete it, after which you can attempt to deploy it again.

### Runtime exited with error: signal: killed

Usually increasing memory of a lambda resolves it.

# Dev

```sh
sam build
sam deploy --template-file template.yaml --stack-name dmarc --capabilities CAPABILITY_IAM CAPABILITY_AUTO_EXPAND

sam build
sam deploy -g --capabilities CAPABILITY_IAM CAPABILITY_AUTO_EXPAND
sam deploy --parameter-overrides 'RecordQueueArn=<arn> RecordBucketName=<name>'
sam sync --watch --parameter-overrides 'RecordQueueArn=<arn> RecordBucketName=<name>'

sam delete --no-prompts

sam sync --watch

sam logs --tail

sam local generate-event sqs receive-message --body '{\"foo\": \"bar\"}' > events/google.json
sam local invoke
sam local invoke --event events/event.json

sam remote invoke
sam remote invoke --event-file events/event.json
```
