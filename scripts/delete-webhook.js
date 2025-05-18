// https://core.telegram.org/bots/api#deletewebhook

require('dotenv').config()
const https = require('https')

https.get({
  hostname: 'api.telegram.org',
  path: `/bot${process.env.BOT_TOKEN}/deleteWebhook`,
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
