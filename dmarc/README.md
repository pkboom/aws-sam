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
