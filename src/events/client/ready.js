// ready.js
const { ActivityType } = require('discord.js');
const colort = require("colors")
module.exports = {
    name: 'ready',
    async execute(client) {
        // logs principais
        console.log(`[LOG] `.yellow + `Estou online na aplicação: ${client.user.username}`);
        console.log(`[LOG] `.yellow + `[LOG] Tenho ${client.users.cache.size} lunnarians em ${client.guilds.cache.size} servidores`)
        
        // status do bot
        const textoStatus = '💸 Play mines!';
        client.user.setActivity(textoStatus, {
            type: ActivityType.Custom
        });
        client.user.setStatus('dnd');
    },
};