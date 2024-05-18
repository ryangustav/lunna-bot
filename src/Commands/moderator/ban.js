const Discord = require("discord.js");
const axios = require("axios")
const getRole = require(`../../util/getRole.js`)
module.exports = {
    data: new Discord.SlashCommandBuilder()
        .setName("ban")
        .setDescription("「🛠️」Banir usuarios")
        .setDMPermission(false)
        .addUserOption(option => 
            option
            .setName('user')
            .setDescription('Usuario que você quer banir')
            .setRequired(true)
        )
        .addStringOption(option => 
            option
            .setName('motivo')
            .setDescription('motivo do banimento')
            .setRequired(true)
        ),
    async execute(interaction, client) {
  const user = interaction.options.getUser('user'); 
  const motivo = interaction.options.getString('motivo'); 
  let user_cargo = user.roles ? user.roles.cache : null;
  let member_cargo = interaction.member.roles.cache;
  let bot_cargo = interaction.guild.members.cache.get(client.user.id).roles.cache
  const comparation = await getRole(user_cargo, member_cargo);
  const bot_comparation = await getRole(user_cargo, bot_cargo)

    //Verificações 
    if (!interaction.member.permissions.has("BAN_MEMBERS") || !interaction.member.permissions.has("ADMINSTRATOR")) return interaction.reply({ content: ":x: | Você não tem permissão para utilizar este comando"})
    if (!user || !motivo ) return interaction.reply({ content: ":x: | Você não informou o usuario"})
    if (interaction.guild.owner === user.id) return interaction.reply({ content: ":x: | Você não pode banir o dono do servidor"})
    if (comparation === true) return interaction.reply({ content: ":x: | Você não pode banir alguem com cargo maior que o seu"})
    if (bot_comparation === true) return interaction.reply({ content: ":x: | Eu não posso banir alguem com cargo maior que o meu"})
   
        interaction.channel.send({
            embeds: [
            new Discord.EmbedBuilder()
            .setTitle(`Banir usuario`)
            .setColor("#be00e8")
            .setDescription(`
            ${interaction.user} você esta prestes a banir ${user}. Tem certeza?
            <:file:1052384025089687614> | Motivo:
            \`${motivo}\`
            `)
            ],
            components: [
            new Discord.ActionRowBuilder()
            .addComponents(
            new Discord.ButtonBuilder()
            .setStyle(`Primary`)
            .setCustomId("confirma")
            .setEmoji(`<:simJEFF:1109206099346862140>`)
            .setLabel(`confirmo`),
            new Discord.ButtonBuilder()
            .setStyle(`Danger`)
            .setCustomId("recuso")
            .setEmoji(`<:naoJEFF:1109179756831854592>`)
            .setLabel(`recuso`),
            )
            ]
            }).then(msg => {
            const collector = msg.createMessageComponentCollector()
            
            collector.on("collect", int => {
            if (int.user.id !== interaction.user.id) return int.reply({ content: `<:naoJEFF:1109179756831854592> | Você não pode clicar nesse botão`, ephemeral: true})
            if (int.customId === "recuso") {
            msg.delete()
            }
            if (int.customId === "confirma") {
            msg.delete()

            user.send({
                embeds: [
                new Discord.EmbedBuilder()
                .setColor('#be00e8')
                .setThumbnail(user.avatarURL({ Dynamic: true }))
                .setDescription(`### Você foi banido do servidor ${interaction.guild.name}`)
                .addFields(
                    {
                    name: `<:users:1055062836704976997> **Membro**`,
                    value: `${user} \n \`${user.id}\``,
                    inline: false
                    },
                    {
                    name: `<:IDD:1052973779153846372> **Moderador**`,
                    value: `${interaction.user} \n \`${interaction.user.username}\``,
                    inline: false
                    },
                    {
                    name: `<:file:1052384025089687614> **Motivo**`,
                    value: `\`${motivo}\``,
                    inline: false
                    },
                    )
                ]
                })
            
            user.ban({ deleteMessageSeconds: 60 * 60 * 24 * 7, reason: `${interaction.user.username}: ${motivo}` }).then(a => {
            int.channel.send({ content: `<:simJEFF:1109206099346862140> | Pronto! O usuario ${user.username} foi banido por ${interaction.user}!`})
            })
            }
        })
    })
    }
}