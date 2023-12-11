import { readdirSync, readFileSync } from 'fs'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import path from 'path'
import yargs from 'yargs/yargs'

const argv = yargs(process.argv.slice(2)).argv

const client = new S3Client({})

let dataPath = path.join(argv.devDir, '..', 'data')

let files = readdirSync(dataPath)

console.log(files)

const run = async () => {
  for (const file of files) {
    let params = {
      Bucket: argv.outputValue,
      Key: `email/${file}`,
      Body: readFileSync(path.join(dataPath, file)),
    }

    await client.send(new PutObjectCommand(params))
  }
}

run()
