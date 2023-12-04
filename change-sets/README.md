```sh
aws cloudformation deploy --template-file template.yaml --stack-name change-sets

// DynamoDB DeletionPolicy: Retain
aws cloudformation delete-stack --stack-name change-sets
```

# Changeset

Use new template

```sh
# This will add a bucket and remove the dynamo db.
# Because the template doesn't have the dynamo db resource.
aws cloudformation create-change-set --stack-name change-sets --change-set-name SampleChangeSet --template-body file://template2.yaml

aws cloudformation list-change-sets --stack-name change-sets

aws cloudformation describe-change-set --stack-name change-sets --change-set-name SampleChangeSet

aws cloudformation execute-change-set --stack-name change-sets --change-set-name SampleChangeSet

aws cloudformation delete-change-set --stack-name change-sets --change-set-name SampleChangeSet
```

Use existing template

- Add a bucket to `template.yaml`

```yaml
Bucket:
  Type: AWS::S3::Bucket
```

```sh
# This will add a bucket and won't remove the dynamo db.
aws cloudformation create-change-set --stack-name change-sets --change-set-name SampleChangeSet --template-body file://template.yaml
```

> If the template is changed and deployed, changes will be made directly.
