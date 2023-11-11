const sqsUtil = require('./utils/sqs')

let response

exports.lambdaHandler = async (event, context) => {
  try {
    const payload = event.body
    /*
	write ur logic here
	.
	.
	.
      */

    const options = {
      queueUrl: process.env.SQS_URL, // required
      messageAttributes: {
        // optional
        source: {
          dataType: 'string',
          stringValue: 'lambda-1',
        },
      },
    }

    const params = sqsUtil.constructDataForSqs(payload, options)
    const sqsResponse = await sqsUtil.sendMessage(params)

    response = {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Sucessfully added data to sqs',
        response: sqsResponse.response,
        // location: ret.data.trim()
      }),
    }
  } catch (err) {
    console.log(err)

    return err
  }

  return response
}
