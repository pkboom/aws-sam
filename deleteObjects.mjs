import { S3Client, DeleteObjectsCommand } from '@aws-sdk/client-s3' // ES Modules import

const client = new S3Client({})

let files = [
  'google.com!spotify.com!1693958400!1694044799.xml',
  'whisnantstrategies.com!s.freepeople.com!1698710400!1698796799.xml',
  'marriott.com!brakspear-uk.co.uk!1698724803!1698811204.xml',
  'test.txt',
]

let objects = files.map(file => ({ Key: file }))

let command = new DeleteObjectsCommand({
  Bucket: 'lambda-vpc-sqslambdas3-17wky1ur8l4e9',
  Delete: {
    Objects: objects,
  },
})

const run = async () => {
  try {
    const response = await client.send(command)

    console.log(response)
  } catch (err) {
    console.error(err)
  }
}

run()
