const { SlashCommandBuilder } = require("discord.js");
const LunarModel = require("../../database/schema/coins_database.js")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("saldo")
        .setDescription("「💰」Veja seu saldo de Lunar Coins")
        .setDMPermission(false),

    async execute(interaction, client) {

    const lunnar_coins_verify = await LunarModel.findOne({ user_id: interaction.user.id });
    if (!lunnar_coins_verify) await LunarModel.create({ user_id: interaction.user.id, coins: 0 })
       
    const lunnar_coins = lunnar_coins_verify ?  lunnar_coins_verify : 0;

        await interaction.reply({
            content: `💰 | Você possui **${lunnar_coins.coins}** lunar coins.`,
            ephemeral: true
        });

    },
};