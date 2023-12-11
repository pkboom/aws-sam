import yargs from 'yargs/yargs'

export const argv = yargs(process.argv.slice(2))
  .option('logGroupName', {
    type: 'string',
  })
  .option('retentionInDays', {
    type: 'string',
  }).argv
