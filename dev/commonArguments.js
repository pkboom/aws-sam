import yargs from 'yargs/yargs'

export const argv = yargs(process.argv.slice(2))
  .option('stackName', {
    type: 'string',
  })
  .option('outputValue', {
    type: 'string',
  }).argv
