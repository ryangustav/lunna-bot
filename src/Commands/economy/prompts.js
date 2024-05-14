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
    let disponiveis_text, disponiveis_image;
    const disponivel_text = {
        free: 60,
        vip: 160
    }
    const disponivel_image = {
        free: 3,
        vip: 10
    }
    if (lunnar_coins.isVip === true) {
        disponiveis_text = disponivel_text.vip
        disponiveis_image = disponivel_image.vip
    }
    if (lunnar_coins.isVip === false) {
        disponiveis_text = disponivel_text.free
        disponiveis_image = disponivel_image.free
    }
        await interaction.reply({
            content: `💰 | Você possui **${disponiveis_text - lunnar_coins.prompts_used}/${disponiveis_text}** prompts e **${disponiveis_image - lunnar_coins.image_prompts_used}/${disponiveis_image}** image prompts.`,
            ephemeral: true
        });

    },
}