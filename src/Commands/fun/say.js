const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("say")
        .setDescription("「📡」Faça eu falar algo")
        .setDMPermission(false)
        .addStringOption(option => 
            option
            .setName('mensagem')
            .setDescription('Mensagem que sera enviada')
            .setRequired(true)
        ),
    async execute(interaction, client) {
  const mensagem = interaction.options.getString('mensagem')
   
        await interaction.reply({
            content: `
${mensagem}

User: ${interaction.user}`,
            ephemeral: false
        });

    },
};