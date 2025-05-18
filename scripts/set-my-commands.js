// https://core.telegram.org/bots/api#setmycommands

require('dotenv').config()
const rl = require('readline').createInterface({ input: process.stdin, output: process.stdout })
const https = require('https')

const commands = []
const submitLine = ':ok'
const skipLine = ':skip'
let skipSubmission = false

rl.write(`Send me the list of commands. Use the format:

command1 - Description
command2 - Another description

Enter '${submitLine}' at the end of the list to submit the commands. Otherwise enter '${skipLine}' to abort the submission.
`)

rl.prompt()

rl.on('line', (line) => {
  if (line === submitLine) {
    rl.close()
    return
  }
  if (line === skipLine) {
    skipSubmission = true
    rl.close()
    return
  }
  const [name, ...descriptionArray] = line.split('-')
  commands.push({
    command: name.trim(),
    description: descriptionArray.join('-').trim(),
  })
}).on('close', () => {
  if (skipSubmission) return

  const payload = JSON.stringify({ commands }, undefined, 2)
  console.log(payload)

  const req = https.request({
    hostname: 'api.telegram.org',
    path: `/bot${process.env.BOT_TOKEN}/setMyCommands`,
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  },
  (res) => {
    let body = ''
    res.on('data', (chunk) => {
      body += chunk
    })
    res.on('end', () => {
      console.log(body)
    })
  }).on('error', console.error)

  req.write(payload)
  req.end()
}).on('SIGINT', () => {
  skipSubmission = true
  rl.close()
})
