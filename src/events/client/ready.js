// ready.js
const { ActivityType } = require('discord.js');

module.exports = {
    name: 'ready',
    async execute(client) {
        // logs principais
        console.log(`[LOG] Estou online na aplicação: ${client.user.username}`);

        // status do bot
        const textoStatus = '💸 Se divirta comigo';
        client.user.setActivity(textoStatus, {
            type: ActivityType.Custom
        });
        client.user.setStatus('idle');
    },
};