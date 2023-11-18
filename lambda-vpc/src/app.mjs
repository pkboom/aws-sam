import Dmarc from './Dmarc.js'
import dns from 'dns'

export const handler = async event => {
  try {
    console.log(event)

    let dmarc = new Dmarc()

    await dmarc.getXml()

    dmarc.toJson()

    await dmarc.useIpToGeo()

    await dmarc.toDocument()

    return {
      statusCode: 200,
    }
  } catch (err) {
    console.log(err)

    return err
  }
}
