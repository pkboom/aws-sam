import yargs from 'yargs/yargs'

export const argv = yargs(process.argv.slice(2))
  .option('sourceArn', {
    type: 'string',
  })
  .option('destinationArn', {
    type: 'string',
  })
  .option('stackName', {
    type: 'string',
  }).argv
