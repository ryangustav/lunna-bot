const { SlashCommandBuilder } = require("discord.js");
const LunarModel = require("../../database/schema/coins_database.js");
const dailyCollect = require('../../database/schema/daily_schema.js');
const transactionsModel = require('../../database/schema/transactions.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("daily")
        .setDescription("「💰」Colete o seu daily")
        .setDMPermission(false),

    async execute(interaction, client) {
    const daily = await dailyCollect.findOne({ user_id: interaction.user.id })
    const lunar_coins = await LunarModel.findOne({ user_id: interaction.user.id })
    const transactions = await transactionsModel.findOne({ user_id: interaction.user.id })
    const id = Math.floor(Math.random() * (999999999 - 111111111 + 1) + 111111111)
    const timestamp = Math.floor(Date.now() / 1000)
    
    if (!daily || daily.daily_collected === false) {

    const random_daily = Math.floor(Math.random() * (5000 - 1000 + 1)) + 1000;


    if (!lunar_coins) {
    await LunarModel.create({ user_id: interaction.user.id, coins: random_daily, isVip: false, prompts_used: 0 })
    } else {
    lunar_coins.coins += random_daily;
    lunar_coins.save();
    }

    if (!daily) {
    await dailyCollect.create({ user_id: interaction.user.id, daily_collected: true})
    } else {
    daily.daily_collected = true;
    daily.save();
    }
    if (!transactions) {
    transactionsModel.create({ user_id: interaction.user.id, transactions: [{ id: id, timestamp: timestamp, mensagem: `Resgatou o daily no valor de \`${random_daily}\` lunar coins`}], transactions_ids: [id]})
    } else {
    transactions.transactions.push({id: id, timestamp: timestamp, mensagem: `Resgatou o daily no valor de \`${random_daily}\` lunar coins`})
    transactions.transactions_ids.push(id)
    transactions.save()
    }
    interaction.reply({ 
    content: `<:gold_donator:1053256617518440478> | Você resgatou o daily e ganhou **${random_daily}** Lunar coins`,
    ephemeral: true
    })

    } else if (daily.daily_collected === true) {
    interaction.reply({ content: `<:naoJEFF:1109179756831854592> | Você já resgatou seu daily hoje!`, ephemeral: true })
    }
    }
};