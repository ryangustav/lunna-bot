const Discord = require("discord.js");
const Topgg = require('@top-gg/sdk');
const LunarModel = require("../../database/schema/coins_database.js");
require('dotenv').config
module.exports = {
    data: new Discord.SlashCommandBuilder()
        .setName("vote")
        .setDescription("「📡」Vote em mim")
        .setDMPermission(false),

    async execute(interaction, client) {
    const top = new Topgg.Api(process.env.topgg);
    const votou = await top.hasVoted(interaction.user.id);
    let lunna_vote = await LunarModel.findOne({ user_id: interaction.user.id });
    const time = Math.floor(Date.now() / 1000)
    if (!lunna_vote) {
    await LunarModel.create({ user_id: interaction.user.id, coins: 0, isVip: false, prompts_used: 0 })
    lunna_vote = await LunarModel.findOne({ user_id: interaction.user.id });
    }


    if (!votou || lunna_vote.hasVoted === true && lunna_vote.voteTimestamp > time) {
let msg = '<:gold_donator:1053256617518440478> | Vote em mim no [topgg](https://top.gg/bot/1222333304028659792) e ganhe alguns benefícios'
if (lunna_vote.hasVoted === true && lunna_vote.voteTimestamp > time) msg = `<:gold_donator:1053256617518440478> | Vote em mim no [topgg](https://top.gg/bot/1222333304028659792) em <t:${lunna_vote.voteTimestamp}:R> e ganhe alguns benefícios`
return interaction.reply({ content: `
${msg}

- Reseta os prompts
- Reseta os prompts de imagem
- Ganhe ate 10k de lunnar coins
`, ephemeral: true })
    } else if (votou === true) {
        const date = new Date()
        date.setHours('12')
        const vote = Math.floor(date.getTime() / 1000)
        const random_vote= Math.floor(Math.random() * (10000 - 1000 + 1)) + 1000;

        await LunarModel.updateOne({ user_id: interaction.user.id }, { $set: { hasVoted: true, voteTimestamp: vote, prompts_used: 0, image_prompts_used: 0 }})
        lunna_vote.coins += random_vote
        lunna_vote.save()
        
        interaction.reply({ content: `
        <:gold_donator:1053256617518440478> | Obrigado por votar ${interaction.user}
        `, ephemeral: true })
    }
    },
};