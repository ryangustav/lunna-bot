const Discord = require("discord.js");

module.exports = {
    data: new Discord.SlashCommandBuilder()
        .setName("bite")
        .setDescription("「🎉」Morda alguem")
        .setDMPermission(false)
        .addUserOption(option => 
            option
            .setName('usuario')
            .setDescription('O usuario que você ira morder')
            .setRequired(true)
        ),
    async execute(interaction, client) {
  const user = interaction.options.getUser('usuario');
  const kiss_image = ["https://i.imgur.com/VFjoWe4.gif", "https://i.imgur.com/oPw9dph.gif", "https://i.imgur.com/qQzKwP9.gif", "https://i.imgur.com/WxYtS74.gif", "https://i.imgur.com/S6Je2yz.gif", "https://i.imgur.com/RxcxL2z.gif", "https://i.imgur.com/ykQA3hF.gif","https://i.imgur.com/q9Q9B1Z.gif"]
  const kiss_random = kiss_image[Math.floor(Math.random() * kiss_image.length)]
  let mensagem = `<:SpecialRoles:1055063301148639252> ${interaction.user} mordeu ${user}!`


 // if (user.id === client.user.id) return interaction.reply({ content: `<:naoJEFF:1109179756831854592> | Eu não quero te beijar não! Mas eu posso ser sua amiga`})
  if (user.id === interaction.user.id) mensagem = `<:SpecialRoles:1055063301148639252> ${interaction.user} mordeu... a si mesmo?!`


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