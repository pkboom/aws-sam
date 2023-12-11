import { S3Client, ListObjectsV2Command, DeleteObjectsCommand } from '@aws-sdk/client-s3'
import yargs from 'yargs/yargs'

const argv = yargs(process.argv.slice(2)).argv

const client = new S3Client({})

const run = async () => {
  let isTruncated = true

  while (isTruncated) {
    let command = new ListObjectsV2Command({
      Bucket: argv.outputValue,
      // MaxKeys: 3,
    })

    const { Contents, IsTruncated, NextContinuationToken } = await client.send(command)

    console.log(`Contents: ${Contents.length}`)

    if (!Contents) break

    isTruncated = IsTruncated

    command.input.ContinuationToken = NextContinuationToken

    let objects = Contents.map(content => ({ Key: content.Key }))

    console.log(objects)

    command = new DeleteObjectsCommand({
      Bucket: argv.outputValue,
      Delete: {
        Objects: objects,
      },
    })

    await client.send(command)
  }

  console.log('Deleted')
}

run()
