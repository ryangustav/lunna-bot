module.exports = {
    name: "interactionCreate",
    async execute(interaction, client) {
        // isChatInputCommand
        if (interaction.isChatInputCommand()) {
 
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