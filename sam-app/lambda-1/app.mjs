import { constructDataForSqs, sendMessage } from './utils/sqs.js'

let response

export const handler = async (event, context) => {
  try {
    const payload = event.body

    const options = {
      queueUrl: process.env.SQS_URL,
      messageAttributes: {
        source: {
          dataType: 'string',
          stringValue: 'lambda-1',
        },
      },
    }

    const params = constructDataForSqs(payload, options)
    const sqsResponse = await sendMessage(params)

    response = {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Sucessfully added data to sqs',
        response: sqsResponse.response,
      }),
    }
  } catch (err) {
    console.log(err)

    return err
  }

  return response
}
