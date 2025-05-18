// https://core.telegram.org/bots/api#setwebhook

require('dotenv').config()
const https = require('https')

const req = https.request({
  hostname: 'api.telegram.org',
  path: `/bot${process.env.BOT_TOKEN}/setWebhook`,
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

req.write(JSON.stringify({ url: `https://${process.env.WEBHOOK_DOMAIN}` }))
req.end()
