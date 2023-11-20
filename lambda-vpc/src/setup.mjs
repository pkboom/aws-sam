import { readdirSync, readFileSync } from 'fs'
import path from 'path'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'

const client = new S3Client({})

export const lambdaHandler = async (event, context) => {
  console.log('setup')
  console.log(process.env.BUCKET_NAME)
  console.log(process.env.LAMBDA_TASK_ROOT)

  try {
    let data = readdirSync(path.join(process.env.LAMBDA_TASK_ROOT, 'data'))

    for (const file of data) {
      console.log(file)
      console.log(path.join(process.env.LAMBDA_TASK_ROOT, 'data', 'test.txt'))

      const params = {
        Bucket: process.env.BUCKET_NAME,
        Key: file,
        Body: readFileSync(path.join(process.env.LAMBDA_TASK_ROOT, 'data', file), 'utf8'),
        // Body: 'my-body',
      }

      try {
        await client.send(new PutObjectCommand(params))
      } catch (err) {
        console.error(err)
      }
    }

    return {
      statusCode: 200,
    }
  } catch (err) {
    console.log(err)

    return err
  }
}
