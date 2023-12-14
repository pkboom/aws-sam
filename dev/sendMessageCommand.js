import { SQSClient, SendMessageCommand } from '@aws-sdk/client-sqs'
import yargs from 'yargs/yargs'

const argv = yargs(process.argv.slice(2)).argv

const client = new SQSClient({})

const run = async () => {
  let input = {
    MessageBody: JSON.stringify({
      Records: [
        {
          s3: {
            object: {
              key: 'google.eml',
            },
          },
        },
      ],
    }),
    QueueUrl: argv.value,
  }
  let command = new SendMessageCommand(input)

  let response = await client.send(command)

  console.log(response)
}

run()
