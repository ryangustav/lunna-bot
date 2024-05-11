const Discord = require("discord.js");

module.exports = {
    data: new Discord.SlashCommandBuilder()
        .setName("kiss")
        .setDescription("「🎉」Beije alguem")
        .setDMPermission(false)
        .addUserOption(option => 
            option
            .setName('usuario')
            .setDescription('O usuario que você ira beijar')
            .setRequired(true)
        ),
    async execute(interaction, client) {
  const user = interaction.options.getUser('usuario');
  const kiss_image = ["https://i.imgur.com/sGVgr74.gif", "https://i.imgur.com/TItLfqh.gif", "https://i.imgur.com/YbNv10F.gif", "https://i.imgur.com/wQjUdnZ.gif", "https://i.imgur.com/lmY5soG.gif", "https://i.imgur.com/KLVAl0T.gif", "https://i.imgur.com/IgGumrf.gif","https://i.imgur.com/e0ep0v3.gif"]
  const kiss_random = kiss_image[Math.floor(Math.random() * kiss_image.length)]
  let mensagem = `<:SpecialRoles:1055063301148639252> ${interaction.user} beijou ${user}!`


  if (user.id === client.user.id) return interaction.reply({ content: `<:naoJEFF:1109179756831854592> | Eu não quero te beijar não! Mas eu posso ser sua amiga`})
  if (user.id === interaction.user.id) mensagem = `<:SpecialRoles:1055063301148639252> ${interaction.user} beijou... a si mesmo?!`


const row = new Discord.ActionRowBuilder()
.addComponents(
new Discord.ButtonBuilder()
.setCustomId(`user_reply`)
.setLabel(`Retribuir`)
.setStyle(`Primary`)
.setEmoji(`<:SpecialRoles:1055063301148639252>`),
);


const embed = new Discord.EmbedBuilder()
.setDescription(`${mensagem}`)
.setColor("#be00e8")
.setImage(`${kiss_random}`)

const msg = await interaction.channel.send({
embeds: [embed],
components: [row]
})
    },
};