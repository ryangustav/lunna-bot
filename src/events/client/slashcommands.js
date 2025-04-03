const bania = require("../../database/schema/banned_user.js");
const axios = require('axios');
const { ActionRowBuilder, ButtonBuilder, MessageFlags } = require('discord.js');

const AUTH_URL = 'https://discord.com/oauth2/authorize?client_id=1222333304028659792&response_type=code&redirect_uri=https%3A%2F%2Flunna.discloud.app%2Foauth2-user&scope=identify+email+guilds.join';
const API_URL = 'https://lunna.discloud.app/get-auth';

module.exports = {
    name: "interactionCreate",
    async execute(interaction, client) {
        if (!interaction.isChatInputCommand()) return;

        console.log(`${interaction.commandName}`)

        try {
            // Verificação de banimento
            let ban = await bania.findOne({ user_id: interaction.user.id });
            if (!ban) {
                ban = await bania.create({ 
                    user_id: interaction.user.id, 
                    isBanned: false, 
                    prompts_sexuais: 0 
                });
            }

            if (ban.isBanned) {
                return interaction.reply({ 
                    content: `<:moderator:1238705467883126865> | Você está banido! Não poderá usar meus comandos. Para contestar o banimento entre em [meu servidor](https://discord.gg/23AhePRDAf)`,
                    flags: MessageFlags.Ephemeral 
                });
            }

            // Verificação de autenticação
            const { data: authData } = await axios.get(`${API_URL}?id=${interaction.user.id}`);
            

            // Execução do comando
            const command = interaction.client.commands.get(interaction.commandName);
            if (!command) {
                return interaction.reply({
                    content: `❌ | Nenhum comando correspondente a **${interaction.commandName}** foi encontrado.`,
                    flags: MessageFlags.Ephemeral
                });
            }

            await command.execute(interaction, client);

        } catch (error) {
            console.error('Erro na execução do comando:', error);
            return interaction.reply({
                content: '❌ | Ocorreu um erro ao executar o comando.',
                flags: MessageFlags.Ephemeral
            });
        }
    }
};