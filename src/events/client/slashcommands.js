const bania = require("../../database/schema/banned_user.js")

module.exports = {
    name: "interactionCreate",
    async execute(interaction, client) {
        // isChatInputCommand
        if (interaction.isChatInputCommand()) {
            const verify_ban = await bania.findOne({ user_id: interaction.user.id })
            if (!verify_ban) await bania.create({ user_id: interaction.user.id, isBanned: false, prompts_sexuais: 0 })
            const ban = await bania.findOne({ user_id: interaction.user.id })
            if (ban.isBanned === true) return interaction.reply({ content: `<:moderator:1238705467883126865> | Você está banido! Não podera usar meus comandos. Para contextar o banimento entre em [meu servidor](https://em-breve.xyz/)`, ephemeral: true })
            // comando utilizado
            const command = interaction.client.commands.get(interaction.commandName);

            // comando inexistente
            if (!command) {
                await interaction.reply({
                    content: `❌ | Nenhum comando correspondente a **${interaction.commandName}** foi encontrado.`,
                    ephemeral: true
                });
                return;
            };

            // solução de erros - try catch
            try {
                await command.execute(interaction, client);
            } catch (err) {
                console.error(err);
                return interaction.reply({
                    content: `❌ | Erro ao executar o comando **${interaction.commandName}**:\`\`\`js\n${err.message}\`\`\``,
                    ephemeral: true
                });
            };

        };

    },
};