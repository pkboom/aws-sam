import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3'

const client = new S3Client({})

export const handler = async event => {
  try {
    console.log(event)

    const command = new GetObjectCommand({
      Bucket: 'sqs-lambda-sqslambdas3-1cmn665rqy0hj',
      Key: 'test.txt',
    })

    try {
      const response = await client.send(command)
      // The Body object also has 'transformToByteArray' and 'transformToWebStream' methods.
      const str = await response.Body.transformToString()
      console.log(str)
    } catch (err) {
      console.error(err)
    }

    return {
      statusCode: 200,
    }
  } catch (err) {
    console.log(err)

    return err
  }
}
