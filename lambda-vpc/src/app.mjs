import Dmarc from './Dmarc.js'

export const handler = async event => {
  try {
    console.log(event)

    let dmarc = new Dmarc()

    await dmarc.getXml()

    dmarc.toJson()

    await dmarc.useIpToGeo()

    await dmarc.getReverses()

    dmarc.toDocument()

    return {
      statusCode: 200,
    }
  } catch (err) {
    console.log(err)

    return err
  }
}
