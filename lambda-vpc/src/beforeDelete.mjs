import { S3Client, ListObjectsV2Command, DeleteObjectsCommand } from '@aws-sdk/client-s3'

const client = new S3Client({})

export const lambdaHandler = async (event, context) => {
  console.log('beforeDelete')

  try {
    let files = []

    let command = new ListObjectsV2Command({
      Bucket: process.env.BUCKET_NAME,
      MaxKeys: 1,
    })

    try {
      let isTruncated = true

      while (isTruncated) {
        const { Contents, IsTruncated, NextContinuationToken } = await client.send(command)

        console.log(Contents)
        files.push(Contents[0].Key)

        isTruncated = IsTruncated

        command.input.ContinuationToken = NextContinuationToken
      }

      console.log(files)
    } catch (err) {
      console.error(err)
    }

    let objects = files.map(file => ({ Key: file }))

    command = new DeleteObjectsCommand({
      Bucket: process.env.BUCKET_NAME,
      Delete: {
        Objects: objects,
      },
    })

    try {
      const response = await client.send(command)

      console.log(response)
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
