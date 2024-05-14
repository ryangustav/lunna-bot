const Discord = require("discord.js");

module.exports = {
    data: new Discord.SlashCommandBuilder()
        .setName("spank")
        .setDescription("「🎉」Bata alguem")
        .setDMPermission(false)
        .addUserOption(option => 
            option
            .setName('usuario')
            .setDescription('O usuario que você ira bater')
            .setRequired(true)
        ),
    async execute(interaction, client) {
  const user = interaction.options.getUser('usuario');
  const kiss_image = ["https://i.imgur.com/SMskPot.gif", "https://i.imgur.com/KWi1dAV.mp4", "https://i.imgur.com/NSeL8jO.gif", "https://i.imgur.com/kUNr4vk.gif", "https://i.imgur.com/T00nSoV.gif", "https://i.imgur.com/b9Iv95p.gif", "https://i.imgur.com/NaLhZ8m.gif","https://i.imgur.com/8p95SIi.gif"]
  const kiss_random = kiss_image[Math.floor(Math.random() * kiss_image.length)]
  let mensagem = `<:SpecialRoles:1055063301148639252> ${interaction.user} bateu ${user}!`


 // if (user.id === client.user.id) return interaction.reply({ content: `<:naoJEFF:1109179756831854592> | Eu não quero te beijar não! Mas eu posso ser sua amiga`})
  if (user.id === interaction.user.id) mensagem = `<:SpecialRoles:1055063301148639252> ${interaction.user} bateu... em si mesmo?!`


const embed = new Discord.EmbedBuilder()
.setDescription(`${mensagem}`)
.setColor("#be00e8")
.setImage(`${kiss_random}`)

const msg = await interaction.channel.send({
embeds: [embed],
})
setTimeout(() => {
    msg.delete()
}, 15000)
    },
};