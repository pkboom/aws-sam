[Quotas and Limits](https://docs.aws.amazon.com/streams/latest/dev/service-sizes-and-limits.html)

Default shard quota: 200 shards / AWS account in ohio

Increasing number of shards takes time on demand mode. Better to have 200 provisioned.

# Error

### Rate exceeded for stream

You cannot update the capacity mode of your data stream more than twice within 24 hours.
