import { CloudWatchLogsClient, StartQueryCommand, GetQueryResultsCommand } from '@aws-sdk/client-cloudwatch-logs'
import { wait } from './helper.js'

class Log {
  constructor() {
    this.queryId = null
    this.results = null
    this.client = new CloudWatchLogsClient()
  }

  async startQuery(input) {
    let command = new StartQueryCommand(input)

    let response = await this.client.send(command)

    this.queryId = response.queryId

    console.log(`QueryId: ${this.queryId}`)
  }

  async getQueryResults() {
    while (true) {
      let command = new GetQueryResultsCommand({
        queryId: this.queryId,
      })

      let response = await this.client.send(command)

      console.log(`Status: ${response.status}`)

      if (response.status === 'Complete') {
        return this.toString(response.results)
      }

      await wait(1000)
    }
  }

  toString(results) {
    return results
      .map(
        result =>
          result
            .filter(item => item.field !== '@ptr')
            .map(item => `${item.field}: ${item.value}`)
            .join('\n') + '\n',
      )
      .join('\n')
  }
}

export default Log
