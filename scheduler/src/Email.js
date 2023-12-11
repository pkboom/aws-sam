import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses'

class Email {
  constructor() {
    this.client = new SESClient()
    this.subject = null
    this.body = null
  }

  setSubject(subject) {
    this.subject = subject

    return this
  }

  setBody(body) {
    this.body = body

    return this
  }

  input() {
    return {
      Source: 'keunbae@inboxmonster.com',
      Destination: {
        ToAddresses: ['dev.inboxmonster@gmail.com'],
      },
      Message: {
        Subject: {
          Data: this.subject,
          Charset: 'UTF-8',
        },
        Body: {
          Text: {
            Data: this.body,
            Charset: 'UTF-8',
          },
        },
      },
      ReplyToAddresses: [],
    }
  }

  async send() {
    let command = new SendEmailCommand(this.input())

    await this.client.send(command)
  }
}

export default Email
