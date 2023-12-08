import yargs from 'yargs/yargs'

export const argv = yargs(process.argv.slice(2)).option('confirm', {
  type: 'boolean',
  default: false,
}).argv
