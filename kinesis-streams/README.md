## Invoke AWS serverless functions locally

> Run docker first.

```sh
sam local invoke

sam local invoke -h # See examples

# if there are multiple functions, provide name
sam local invoke HelloWorldFunction

sam local invoke HelloWorldFunction | jq

sam local invoke HelloWorldFunction --event events/event.json
```

# Generate events for lambda function

```sh
sam local generate-event

sam local generate-event -h # Refer to examples and commands

sam local generate-event kinesis -h # Refer to commands

sam local generate-event kinesis get-records -h

sam local generate-event kinesis get-records | sam local invoke HelloWorldFunction -e -
# -e, --event event.json: Pass in the value '-' to input JSON via stdin

sam local generate-event kinesis get-records --data “My custom content”
# --data TEXT: Specify the data name you'd like, otherwise the default = Hello, this is a test 123.

# Using a custom json
sam local generate-event kinesis get-records --data “$(jq -c < event.json)” | sam local invoke -e - MyLambda
```
