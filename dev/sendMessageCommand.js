import { SQSClient, SendMessageCommand } from '@aws-sdk/client-sqs'
import yargs from 'yargs/yargs'

const argv = yargs(process.argv.slice(2)).argv

const client = new SQSClient({})

function s3Message() {
  return {
    Records: [
      {
        s3: {
          object: {
            key: argv.value3,
          },
        },
      },
    ],
  }
}

const run = async () => {
  let input = {
    MessageBody: JSON.stringify(s3Message()),
    QueueUrl: argv.value,
  }
  let command = new SendMessageCommand(input)

  for (let i = 0; i < argv.value2; i++) {
    try {
      await client.send(command)
    } catch (error) {
      console.log(error)
    }
  }

  console.log(`Sent ${argv.value2} messages.`)
}

run()
