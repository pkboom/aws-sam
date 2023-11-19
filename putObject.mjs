import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3' // ES Modules import
import { readFileSync } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

let __dirname = path.dirname(fileURLToPath(import.meta.url))

const client = new S3Client({
  // I'm using default credentials from ~/.aws/credentials
  // region: 'us-east-1',
  // credentials: {
  //   accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  //   secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  // },
})

const run = async () => {
  let files = [
    // 'google.com!spotify.com!1693958400!1694044799.xml',
    // 'whisnantstrategies.com!s.freepeople.com!1698710400!1698796799.xml',
    // 'marriott.com!brakspear-uk.co.uk!1698724803!1698811204.xml',
    'test.txt',
  ]

  Promise.all(
    files.map(async file => {
      const params = {
        Bucket: 'lambda-vpc-sqslambdas3-17wky1ur8l4e9',
        Key: file,
        Body: readFileSync(path.join(__dirname, 'data', file), 'utf8'),
      }

      let command = new PutObjectCommand(params)

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
