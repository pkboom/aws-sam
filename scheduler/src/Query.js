import Log from './Log.js'

class Query {
  constructor() {
    this.from = null
    this.to = null
    this.logGroup = null
    this.query = null
    this.log = new Log()
  }

  setFrom(from) {
    this.from = from

    return this
  }

  setTo(to) {
    this.to = to

    return this
  }

  setLogGroup(logGroup) {
    this.logGroup = logGroup

    return this
  }

  setQuery(query) {
    this.query = query

    return this
  }

  async run() {
    await this.log.startQuery(this.input())

    return await this.log.getQueryResults()
  }

  input() {
    return {
      logGroupName: this.logGroup,
      startTime: this.from / 1000,
      endTime: this.to / 1000,
      queryString: this.query,
    }
  }
}

export default Query
