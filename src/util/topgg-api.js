const Topgg = require('@top-gg/sdk')
const express = require('express')
require('dotenv').config();

function topgg() {
const app = express()
const webhook = new Topgg.Webhook(process.env.topgg)


app.post("/dblwebhook", webhook.listener(vote => {
console.log(vote.user) 
  
const data = { content: `<:gold_donator:1053256617518440478> | Obrigado por votar <@${vote.user}>` }; 
const webhookUrl = "https://discord.com/api/webhooks/1240122224472625232/3r0xvSUu_qEGUJotAL53f6eAAGdLGrWfIOCMPSUcy9qWYdiBp9wbOqR36xGv5ql8whAS"
const headers = { 'Content-Type': 'application/json' };
    
axios.post(webhookUrl, data, { headers })
}))
  
  app.listen(80)
}

module.exports = topgg;