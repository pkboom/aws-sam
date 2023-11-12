import { SQSClient, SendMessageCommand } from '@aws-sdk/client-sqs'

const sqs = new SQSClient({
  // We can store these credentials in lambda environment variables
  accessKeyId: process.env.ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  apiVersion: process.env.AWS_SQS_API_VERSION,
  region: process.env.AWS_REGION,
})

export const constructDataForSqs = (body, options = {}) => {
  if (!options.queueUrl) {
    throw new Error('QueueUrl not given')
  }
  if (!body) {
    throw new Error('body not given')
  }

  let MessageAttributes = {}

  if (options.messageAttributes) {
    for (const key of Object.keys(options.messageAttributes)) {
      MessageAttributes[key] = {
        DataType: options.messageAttributes[key].dataType,
        StringValue: options.messageAttributes[key].stringValue,
      }
    }
  }

  const params = {
    MessageAttributes,
    MessageBody: JSON.stringify(body),
    QueueUrl: options.queueUrl,
  }

  return params
}

export const sendMessage = async params => {
  try {
    const data = await sqs.send(new SendMessageCommand(params))

    console.log('Success', data.MessageId)

    return {
      success: true,
      response: data,
    }
  } catch (err) {
    console.log('Error in sqs-util sendMessage', err)

    throw err
  }
}
