const Discord = require("discord.js");

module.exports = {
    data: new Discord.SlashCommandBuilder()
        .setName("serverinfo")
        .setDescription("「🔎」Veja as informações do servidor")
        .setDMPermission(false),
    async execute(interaction, client) {
const guild = interaction.guild
const client_guild = guild.members.cache.get(client.user.id)
const features = await features_calc(guild.features);




const row = new Discord.ActionRowBuilder()
.addComponents(
new Discord.StringSelectMenuBuilder()
.setCustomId(`infoSelect`)
.setPlaceholder(`Outras informações`)
.addOptions(
    new Discord.StringSelectMenuOptionBuilder()
    .setLabel(`${guild.name} - Banner`)
    .setValue('banner')
    .setDescription('Veja qual o banner do servidor')
    .setEmoji('<:gratian_imagem:1105112415038865538>')
    .setDefault(false),
    new Discord.StringSelectMenuOptionBuilder()
    .setLabel(`${guild.name} - Icon`)
    .setValue('icon')
    .setDescription('Veja o icon do servidor')
    .setEmoji('<:gratian_imagem:1105112415038865538>')
    .setDefault(false)
)
)

const embed = new Discord.EmbedBuilder()
.setColor("#be00e8")
.setTitle(`${guild.name} | Server info<:hypesquadevents:1238705175695196212>`)
.setThumbnail(guild.iconURL({ dynamic: true }))
.setDescription(` `)
.addFields(
{
name: `<:IDD:1052973779153846372> Guild id`,
value: `${guild.id}`,
inline: true
},
{
name: `<a:staff:1238703736524771491> Guild owner`,
value: `<@${guild.ownerId}>`,
inline: true
},
{
name: `<a:Boost:1238718692104212532> Boosts`,
value: `${guild.premiumSubscriptionCount} (${guild.premiumTier} level's)`,
inline: true
},
{
name: `<:timer:1104785133116080220> Criado em`,
value: `<t:${Math.floor(guild.createdTimestamp / 1000)}:f> \n(<t:${Math.floor(guild.createdTimestamp / 1000)}:R>)`,
inline: true
},
{
name: `<:gold_donator:1053256617518440478> Entrei em`,
value: `<t:${Math.floor(client_guild.joinedTimestamp / 1000)}:f> \n(<t:${Math.floor(client_guild.joinedTimestamp / 1000)}:R>)`,
inline: true
},
{
name: `<:bl_info:1053256877896634439> Infos`,
value: `
<:users:1055062836704976997> ${guild.memberCount} membros
<:white__text_7cr:1221848448605618296> ${guild.channels.channelCountWithoutThreads} Canais/categorias
<:file:1052384025089687614> ${guild.channels.cache.filter(channel => channel.type === 0).size} texto
<a:voice:1238955552994889748> ${guild.channels.cache.filter(channel => channel.type === 2).size} voz
`,
inline: false
},
{
name: `<:simJEFF:1109206099346862140> Features`,
value: `
${features}
`,
inline: false
},
)

interaction.reply({ content: `${interaction.user}` })
interaction.channel.send({ embeds: [embed], components: [row] }).then(msg => {

    const collector = msg.channel.createMessageComponentCollector()
    
    collector.on('collect', int => {
    if (int.message.id !== msg.id) return
    if (int.user.id !== interaction.user.id) return interaction.reply({ content: `<:naoJEFF:1109179756831854592> | Essa interação não e sua!`, ephemeral: true})
    if (!int.isStringSelectMenu()) return
    const select = int.values[0]
if (select === 'banner') {
if (!guild.banner) return int.reply({ content: `<:naoJEFF:1109179756831854592> | O servidor não tem banner`, ephemeral: true })
int.reply({ attachment: [guild.banner]})
}
if (select === 'icon') {
if (!guild.iconURL({ dynamic: true })) return int.reply({ content: `<:naoJEFF:1109179756831854592> | O servidor não tem icon`, ephemeral: true })
int.reply({ content: `${guild.iconURL({ dynamic: true })}`, ephemeral: true})
}
})
})


async function features_calc(feature) {
if (!feature) return `<:naoJEFF:1109179756831854592>`

const featuresCalc = {
ANIMATED_BANNER: `<:simJEFF:1109206099346862140> Banner animado`,
CHANNEL_ICON_EMOJIS_GENERATED: `<:simJEFF:1109206099346862140> Emojis no icone do canal`,
ANIMATED_ICON: `<:simJEFF:1109206099346862140> Icon animado`,
APPLICATION_COMMAND_PERMISSIONS_V2: `<:simJEFF:1109206099346862140> Application command v2`,
AUTO_MODERATION: `<:simJEFF:1109206099346862140> Auto moderador`,
BANNER: `<:simJEFF:1109206099346862140> Banner`,
COMMUNITY: `<:simJEFF:1109206099346862140> Comunidade`,
CREATOR_MONETIZABLE_PROVISIONAL: `<:simJEFF:1109206099346862140> Monetização provisória do criador`,
CREATOR_STORE_PAGE: `<:simJEFF:1109206099346862140> Página de armazenamento do criador`,
DEVELOPER_SUPPORT_SERVER: `<:simJEFF:1109206099346862140> Servidor de suporte ao desenvolvedor`,
DISCOVERABLE: `<:simJEFF:1109206099346862140> Discoverable`,
FEATURABLE: `<:simJEFF:1109206099346862140> Featurable`,
INVITES_DISABLED: `<:simJEFF:1109206099346862140> Convites desativados`,
INVITE_SPLASH: `<:simJEFF:1109206099346862140> Convite inicial`,
MEMBER_VERIFICATION_GATE_ENABLED: `<:simJEFF:1109206099346862140> Verificação de membro`,
MORE_STICKERS: `<:simJEFF:1109206099346862140> Mais figurinhas`,
NEWS: `<:simJEFF:1109206099346862140> News`,
PARTNERED: `<:simJEFF:1109206099346862140> Partnered`,
PREVIEW_ENABLED: `<:simJEFF:1109206099346862140> Visualização`,
ROLE_ICONS: `<:simJEFF:1109206099346862140> Icone dos cargos`,
ROLE_SUBSCRIPTIONS_AVAILABLE_FOR_PURCHASE: `<:simJEFF:1109206099346862140> Assinatura de cargo disponivel para compra`,
ROLE_SUBSCRIPTIONS_ENABLED: `<:simJEFF:1109206099346862140> Assinatura de cargo`,
TICKETED_EVENTS_ENABLED: `<:simJEFF:1109206099346862140> Ticket event`,
VANITY_URL: `<:simJEFF:1109206099346862140> Vanity URL`,
VERIFIED: `<:simJEFF:1109206099346862140> Verificado`,
VIP_REGIONS: `<:simJEFF:1109206099346862140> Região vip`,
WELCOME_SCREEN_ENABLED: `<:simJEFF:1109206099346862140> Tela de bem-vindos`,
}


return feature.map(featureName => featuresCalc[featureName] || '<:naoJEFF:1109179756831854592>');
}
    }
}