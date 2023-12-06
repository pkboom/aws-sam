import yargs from 'yargs/yargs'

export const argv = yargs(process.argv.slice(2))
  .option('count', {
    type: 'number',
  })
  .option('stackName', {
    type: 'string',
  }).argv
