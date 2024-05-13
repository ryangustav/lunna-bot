const { SlashCommandBuilder, ApplicationFlagsBitField } = require("discord.js");
const LunarModel = require("../../database/schema/coins_database.js")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("prompts")
        .setDescription("「💰」Veja quantos prompts você tem disponivel")
        .setDMPermission(false),

    async execute(interaction, client) {

    const lunnar_coins_verify = await LunarModel.findOne({ user_id: interaction.user.id });
    if (!lunnar_coins_verify) await LunarModel.create({ user_id: interaction.user.id, coins: 0, isVip: false, prompts_used: 0 })
       
    const lunnar_coins = lunnar_coins_verify ?  lunnar_coins_verify : 0;
    let disponiveis;
    const disponivel = {
        free: 60,
        vip: 160
    }
    if (lunnar_coins.isVip === true) disponiveis = disponivel.vip
    if (lunnar_coins.isVip === false) disponiveis = disponivel.free
        await interaction.reply({
            content: `💰 | Você possui **${60 - lunnar_coins.prompts_used}/${disponiveis}** prompts.`,
            ephemeral: true
        });

    },
}