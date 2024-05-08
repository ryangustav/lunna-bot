const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("「📡」Veja minha latência atual")
        .setDMPermission(false),

    async execute(interaction, client) {

        await interaction.reply({
            content: `🏓 | Pong! Minha latência atual é de **${client.ws.ping}ms**.`,
            ephemeral: true
        });

    },
};