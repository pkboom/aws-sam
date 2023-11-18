import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3'
import Dmarc from './Dmarc.js'

const client = new S3Client({})

export const handler = async event => {
  try {
    console.log(event)

    let command = new GetObjectCommand({
      Bucket: 'sqs-lambda-sqslambdas3-3pzfmb9wvv8m',
      // Key: 'test.txt',
      Key: 'whisnantstrategies.com!s.freepeople.com!1698710400!1698796799.xml',
    })

    let dmarc
    let xml

    try {
      let response = await client.send(command)

      xml = await response.Body.transformToString()

      console.log(xml)
    } catch (err) {
      console.error(err)
    }

    dmarc = new Dmarc(xml).toJson()

    let command1 = new GetObjectCommand({
      Bucket: 'sqs-lambda-sqslambdas3-3pzfmb9wvv8m',
      Key: 'GeoLite2-ASN.mmdb',
    })

    let command2 = new GetObjectCommand({
      Bucket: 'sqs-lambda-sqslambdas3-3pzfmb9wvv8m',
      Key: 'GeoLite2-ASN.mmdb',
    })

    try {
      let response = await client.send(command1)

      let countryBuffer = Buffer.from(await response.Body.transformToByteArray())

      response = await client.send(command2)

      let asnBuffer = Buffer.from(await response.Body.transformToByteArray())

      dmarc.useIpToGeo(countryBuffer, asnBuffer)
    } catch (err) {
      console.error(err)
    }

    dmarc.toDocument()

    console.log('done')

    return {
      statusCode: 200,
    }
  } catch (err) {
    console.log(err)

    return err
  }
}
