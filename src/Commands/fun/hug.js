const Discord = require("discord.js");

module.exports = {
    data: new Discord.SlashCommandBuilder()
        .setName("hug")
        .setDescription("「🎉」Abrace alguem")
        .setDMPermission(false)
        .addUserOption(option => 
            option
            .setName('usuario')
            .setDescription('O usuario que você ira abraçar')
            .setRequired(true)
        ),
    async execute(interaction, client) {
  const user = interaction.options.getUser('usuario');
  const kiss_image = ["https://i.imgur.com/fWCJmEj.gif", "https://i.imgur.com/r9aU2xv.gif", "https://i.imgur.com/wOmoeF8.gif", "https://i.imgur.com/nrdYNtL.gif", "https://i.imgur.com/BPLqSJC.gif", "https://i.imgur.com/ntqYLGl.gif", "https://i.imgur.com/v47M1S4.gif","https://i.imgur.com/4oLIrwj.gif"]
  const kiss_random = kiss_image[Math.floor(Math.random() * kiss_image.length)]
  let mensagem = `<:SpecialRoles:1055063301148639252> ${interaction.user} abraçou ${user}!`


  //if (user.id === client.user.id) return interaction.reply({ content: `<:naoJEFF:1109179756831854592> | Eu não quero te beijar não! Mas eu posso ser sua amiga`})
  if (user.id === interaction.user.id) mensagem = `<:SpecialRoles:1055063301148639252> ${interaction.user} abraçou... a si mesmo?!`


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