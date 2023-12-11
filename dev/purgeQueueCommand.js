import { SQSClient, PurgeQueueCommand } from '@aws-sdk/client-sqs'
import yargs from 'yargs/yargs'

const argv = yargs(process.argv.slice(2)).argv

const client = new SQSClient({})

const run = async () => {
  let input = {
    QueueUrl: argv.outputValue,
  }

  let command = new PurgeQueueCommand(input)

  let response = await client.send(command)

  console.log(response)
}

run()
