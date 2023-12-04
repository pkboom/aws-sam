```sh
aws cloudformation deploy --template-file template.yaml --stack-name existing-resources

// DynamoDB DeletionPolicy: Retain
aws cloudformation delete-stack --stack-name existing-resources
```

# Remove resources from the stack

Add 'DeletionPolicy: Retain' not to remove resouces when updating the stack.

```yaml
DeletionPolicy: Retain
```

Remove resouces to be imported to another stack by removing the corresponding part in the template.
