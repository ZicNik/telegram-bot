// https://core.telegram.org/bots/api#getwebhookinfo

require('dotenv').config()
const https = require('https')

https.get({
  hostname: 'api.telegram.org',
  path: `/bot${process.env.BOT_TOKEN}/getWebhookInfo`,
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
