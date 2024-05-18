const Discord = require("discord.js");

module.exports = {
    data: new Discord.SlashCommandBuilder()
        .setName("botinfo")
        .setDescription("「📡」Veja as minhas informações")
        .setDMPermission(false),

    async execute(interaction, client) {

      const embed = new Discord.EmbedBuilder()
      .setTitle(`${client.user.username} | Botinfo<:bl_info:1053256877896634439>`)
      .setColor('#be00e8')
      .setDescription(`
<:SpecialRoles:1055063301148639252> *Olá, ${interaction.user}. Me chamo lunna, sou uma bot multiproposito*

<:developer:1238705584098775100> | Developer: Kgzin
<:gold_donator:1053256617518440478> | My server: [Lunna - Oficial server](https://discord.gg/ccpv59XB5p)
<:timer:1104785133116080220> | Uptime: <t:${Math.floor(client.readyTimestamp / 1000)}:R>
`)
interaction.reply({ embeds: [embed] })
    },
};