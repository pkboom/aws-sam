import { S3Client } from '@aws-sdk/client-s3'

const s3Client = new S3Client()

export const handler = async (event, context) => {
  try {
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'hello world',
      }),
    }
  } catch (err) {
    console.log(err)
    return err
  }
}
