const dailyCollect = require("../database/schema/daily_schema");
const LunarModel = require("../database/schema/coins_database");
const cron = require("node-cron")
const axios = require("axios")
const { WebhookClient } = require("discord.js")

function dailyRestart() {
        //Puxando o tempo ate as 00:00
cron.schedule('0 0 * * * ', async daily => {

 await dailyCollect.updateMany({}, { $set: { daily_collected: false } })
 await LunarModel.updateMany({}, { $set: { prompts_used: 0, image_prompts_used: 0 }})

 const data = { content: "<:gold_donator:1053256617518440478> | O daily e os prompts foram resetados!" }; 
 const webhookUrl = "https://discord.com/api/webhooks/1113142436500344852/F7IX3nXQHCqeRf4NI4nM4zAtNZGL3pG66IThe_2ytGJ8vFsZDEcQgdMDVH9cYf7xc-iO"
 const headers = { 'Content-Type': 'application/json' };
 
 axios.post(webhookUrl, data, { headers })
})

    }


module.exports = dailyRestart;