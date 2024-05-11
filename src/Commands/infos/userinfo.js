const Discord = require("discord.js");
const axios = require("axios")

module.exports = {
    data: new Discord.SlashCommandBuilder()
        .setName("userinfo")
        .setDescription("「🔎」Veja as informações do usuario")
        .setDMPermission(false)
        .addUserOption(option => 
            option
            .setName('user')
            .setDescription('usuario que você quer ver as informações')
            .setRequired(false)
        ),
    async execute(interaction, client) {
  const user = interaction.options.getUser('user')
  const member = user || interaction.user;
  const userBadges = member.flags.toArray();
  const bigRole = interaction.guild.members.cache.get(member.id).roles.cache
  .sort((a, b) => b.position - a.position)
  .map(role => role)
  .slice(0, 3);
  const joinTime = Math.floor(interaction.guild.members.cache.get(member.id).joinedTimestamp / 1000);
  const createdTime = parseInt(member.createdTimestamp / 1000);
  const booster = member.premiumSince ? `<a:Boost:1238718692104212532> (${Math.floor(member.premiumSinceTimestamp / 1000)})` : '<:naoJEFF:1109179756831854592>';
  let permissions = '';
 await interaction.guild.members.cache.get(member.id).permissions.toArray().forEach(perm => {
    permissions += `${perm} `.replace(' ', ', ')
  })
  const response = await axios.get(`https://discord.com/api/v10/users/${member.id}`, {
    headers: { Authorization: `Bot ${client.token}` },
  });
 const banner = response.data.banner ? `https://cdn.discordapp.com/banners/${member.id}/${response.data.banner}.gif` : null;

const row = new Discord.ActionRowBuilder()
.addComponents(
new Discord.StringSelectMenuBuilder()
.setCustomId(`infoSelect`)
.setPlaceholder(`Outras informações`)
.addOptions(
    new Discord.StringSelectMenuOptionBuilder()
    .setLabel(`${member.username} - Permissões`)
    .setValue('permissions')
    .setDescription('Veja as permissões do usuario')
    .setEmoji('<:moderator:1238705467883126865>')
    .setDefault(false),
    new Discord.StringSelectMenuOptionBuilder()
    .setLabel(`${member.username} - Cargos`)
    .setValue('roles')
    .setDescription('Veja todos os cargos do usuario')
    .setEmoji('<:IDD:1052973779153846372>')
    .setDefault(false),
    new Discord.StringSelectMenuOptionBuilder()
    .setLabel(`${member.username} - Icon`)
    .setValue('icon')
    .setDescription('Veja o avatar do usuario')
    .setEmoji('<:gratian_imagem:1105112415038865538>')
    .setDefault(false),
    new Discord.StringSelectMenuOptionBuilder()
    .setLabel(`${member.username} - Banner`)
    .setValue('banner')
    .setDescription('Veja o banner do usuario')
    .setEmoji('<:gratian_imagem:1105112415038865538>')
    .setDefault(false)
)
)

const Embeds = new Discord.EmbedBuilder()
.setTitle(`${client.user.username} | User info<:users:1055062836704976997>`)
.setColor("#be00e8")
.setThumbnail(`${member.avatarURL({ dynamic: true })}`)
.setDescription(` `)
.addFields(
{
name: `<:bughunter2:1238703129298735105> Badges`,
value: `${badges_user(userBadges).join("") || '<:naoJEFF:1109179756831854592>'} `,
inline: true
},
{
name: `<a:Boost:1238718692104212532> Booster`,
value: `${booster} `,
inline: true
},
{
name: `<:moderator:1238705467883126865> Maiores cargos`,
value: `${bigRole || 'Não possui cargos'} `,
inline: false
},
{
name: `<:timer:1104785133116080220> Data de entrada`,
value: `<t:${joinTime}:f> (<t:${joinTime}:R>)`,
inline: true
},
{
name: `<:timer:1104785133116080220> Data de criação da conta`,
value: `<t:${createdTime}:f> (<t:${createdTime}:R>)`,
inline: true
},

)

interaction.reply({ content: `${member}`})
interaction.channel.send({ embeds: [Embeds], components: [row] }).then(msg => {

const collector = msg.channel.createMessageComponentCollector()

collector.on('collect', int => {
if (int.message.id !== msg.id) return
if (int.user.id !== interaction.user.id) return interaction.reply({ content: `<:naoJEFF:1109179756831854592> | Essa interação não e sua!`, ephemeral: true})
if (!int.isStringSelectMenu()) return
const select = int.values[0]

if (select === 'permissions') {
int.reply({ content: `\`\`\`${permissions}\`\`\``, ephemeral: true})
}


if (select === 'roles') {
int.reply({ content: `${interaction.guild.members.cache.get(member.id).roles.cache
    .sort((a, b) => b.position - a.position)
    .map(role => role)}`, ephemeral: true})
}
if (select === 'icon') {
if (!member.avatarURL()) return int.reply({ content: `<:naoJEFF:1109179756831854592> | O usuario não possui avatar`, ephemeral: true})
int.reply({ content: `${member.avatarURL({ dynamic: true })}`, ephemeral: true})
}
if (select === 'banner') {
if (!banner) return int.reply({ content: `<:naoJEFF:1109179756831854592> | O usuario não possui banner`, ephemeral: true})
 int.reply({ embeds: [
new Discord.EmbedBuilder()
.setImage(banner)
], ephemeral: true})
}
})
})


function badges_user(badges_user) {
    if (!badges_user) return '<:naoJEFF:1109179756831854592>';

    const badgeObj = {
        ActiveDeveloper: "<:activedev:1238702739245236284>",
        BugHunterLevel1: '<:bughunter:1238703112831766548>',
        BugHunterLevel2: "<:bughunter2:1238703129298735105>",
        PremiumEarlySupporter: "<:EarlySupporter:1238703275826479105>",
        Partner: "<a:partner:1238703567645446216>",
        Staff: "<a:staff:1238703736524771491>",
        HypeSquadOnlineHouse1: "<:hypesquad3:1238703963432292452>", // bravery
        HypeSquadOnlineHouse2: "<:hypesquad:1238704866948546621>", // brilliance
        HypeSquadOnlineHouse3: "<:hypesquad2:1238704992580538431>", // balance
        Hypesquad: "<:hypesquadevents:1238705175695196212>",
        CertifiedModerator: "<:moderator:1238705467883126865>",
        VerifiedDeveloper: "<:developer:1238705584098775100>",
      }
    
      return badges_user.map(badgeName => badgeObj[badgeName] || '<:naoJEFF:1109179756831854592>');
}

    },
};