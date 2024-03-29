import { input, confirm } from '@inquirer/prompts'
import autocomplete from 'inquirer-autocomplete-standalone'
import fuzzy from 'fuzzy'
import { readdirSync, readFileSync, existsSync } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { execSync } from 'child_process'
import toml from 'toml'

async function search(options, input = '') {
  let results = await new Promise(resolve => {
    setTimeout(() => {
      resolve(fuzzy.filter(input, options).map(el => el.original))
    }, 200)
  })

  return results.map(item => ({
    value: item,
    // description: `${item} - description`,
  }))
}

let devDir = path.dirname(fileURLToPath(import.meta.url))

let answers = { devDir }

answers['command'] = await autocomplete({
  message: 'What do you want to do?',
  source: async (input = '') => {
    let commands = readdirSync(devDir)
      .filter(file => file.includes('Command'))
      .map(file => file.replace('.js', ''))
      .sort()

    return await search(commands, input)
  },
})

if (['fillBucketCommand'].includes(answers.command)) {
  console.log('- It needs `data` folder in the root directory.')
}

if (['verifyEmailIdentityCommand'].includes(answers.command)) {
  answers['value1'] = await input({
    message: 'Email?',
  })
} else if (['deleteLayerVersionCommand'].includes(answers.command)) {
  answers['value1'] = await input({
    message: 'Layer name?',
  })

  answers['value2'] = await input({
    message: 'Version number?',
  })
} else if (['deleteLogGroupsCommand'].includes(answers.command)) {
  answers['value1'] = await confirm({
    message: 'Are you sure to delete all log groups?',
  })
} else if (['putRetentionPolicyCommand'].includes(answers.command)) {
  answers['value1'] = await autocomplete({
    message: 'Log group name?',
    source: async (input = '') => {
      let logGroups = JSON.parse(execSync('aws logs describe-log-groups').toString()).logGroups.map(
        logGroup => logGroup.logGroupName,
      )

      return await search(logGroups, input)
    },
  })

  answers['value2'] = await input({
    message: 'Retion in days',
    default: 7,
  })
} else {
  // These commands need a stack name.
  answers['stackName'] = await autocomplete({
    message: 'What is the stack name?',
    source: async (input = '') => {
      let stacks = readdirSync(process.cwd(), { withFileTypes: true })
        .filter(dir => dir.isDirectory())
        .map(dir => dir.name)
        .filter(dir => !dir.startsWith('.'))
        .filter(dir => !['dev', 'node_modules', 'data', 'data_backup'].includes(dir))

      if (existsSync(path.join(process.cwd(), 'samconfig.toml'))) {
        let config = toml.parse(readFileSync(path.join(process.cwd(), 'samconfig.toml')))

        stacks.push(config.default.global.parameters.stack_name)
      }

      return await search(stacks, input)
    },
  })

  let stackOutputs

  try {
    stackOutputs = JSON.parse(
      execSync(`sam list stack-outputs --stack-name ${answers['stackName']} --output json`).toString(),
    )
  } catch (error) {
    throw new Error('You need to deploy the stack first.')
  }

  if (['sendMessageBatchCommand', 'sendMessageCommand', 'purgeQueueCommand'].includes(answers.command)) {
    console.log('- It needs a url.')
  }

  if (['startMessageMoveTaskCommand'].includes(answers.command)) {
    answers['value1'] = await autocomplete({
      message: 'What is the sourceArn?',
      source: async (input = '') => {
        let outputKeys = stackOutputs.map(output => output.OutputKey)

        return await search(outputKeys, input)
      },
    })

    answers['sourceArn'] = stackOutputs.find(output => output.OutputKey === answers['value1'])?.OutputValue

    answers['value2'] = await autocomplete({
      message: 'What is the destinationArn?',
      source: async (input = '') => {
        let outputKeys = stackOutputs.map(output => output.OutputKey)

        return await search(outputKeys, input)
      },
    })

    answers['destinationArn'] = stackOutputs.find(output => output.OutputKey === answers['value2'])?.OutputValue
  } else {
    answers['outputKey'] = await autocomplete({
      message: 'What is the outputKey?',
      source: async (input = '') => {
        let outputKeys = stackOutputs.map(output => output.OutputKey)

        return await search(outputKeys, input)
      },
    })

    answers['value1'] = stackOutputs.find(output => output.OutputKey === answers['outputKey'])?.OutputValue
  }
}

if (['sendMessageCommand', 'sendMessageBatchCommand'].includes(answers.command)) {
  answers['value2'] = await input({
    message: 'Count?',
    default: 1,
  })

  answers['value3'] = await autocomplete({
    message: 'Key?',
    source: async (input = '') => {
      let emls = ['email/biggest', 'email/whisnantstrategies.eml', 'email/118']

      return await search(emls, input)
    },
  })
} else if (['setQueueAttributesCommand'].includes(answers.command)) {
  answers['value2'] = await input({
    message: 'VisibilityTimeout?',
    default: 60,
  })
} else if (['updateFunctionConfigurationCommand'].includes(answers.command)) {
  answers['value2'] = await input({
    message: 'Memory size?',
  })
} else if (['putObjectCommand'].includes(answers.command)) {
  answers['value2'] = await input({
    message: 'Key?(full path)',
  })
}

console.log(answers)

export const args = answers
