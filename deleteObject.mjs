import { S3Client, DeleteObjectCommand } from '@aws-sdk/client-s3' // ES Modules import

const client = new S3Client({})

const run = async () => {
  let files = [
    'google.com!spotify.com!1693958400!1694044799.xml',
    'whisnantstrategies.com!s.freepeople.com!1698710400!1698796799.xml',
    'marriott.com!brakspear-uk.co.uk!1698724803!1698811204.xml',
    'test.txt',
  ]

  Promise.all(
    files.map(async file => {
      const params = {
        Bucket: 'lambda-vpc-sqslambdas3-gvqrbew5jpuu',
        Key: file,
      }

      let command = new DeleteObjectCommand(params)

      try {
        const response = await client.send(command)

        console.log(response)
      } catch (err) {
        console.error(err)
      }
    }),
  )
}

run()
