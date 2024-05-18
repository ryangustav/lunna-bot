const Discord = require("discord.js");
const axios = require("axios")
const getRole = require(`../../util/getRole.js`)
module.exports = {
    data: new Discord.SlashCommandBuilder()
        .setName("clear")
        .setDescription("「🛠️」Apague mensagens")
        .setDMPermission(false)
        .addNumberOption(option => 
            option
            .setName('quantidade')
            .setDescription('quantidade que vocÊ quer apagar')
            .setRequired(true)
        ),
    async execute(interaction, client) {
  const quantia = interaction.options.getNumber('quantidade');

  //Definições
const quantidade = quantia / 100;
const decimais = quantidade.toFixed(2).toString().split('.');
let dec = decimais[1];
let Break = false
let clearnedSize = 0;
//ifs 
if (!interaction.member.permissions.has("MANAGE_MESSAGES") || !interaction.member.permissions.has("ADMINSTRATOR")) return interaction.channel.send(":x: | Você não tem permissão para utilizar este comando")
if (!quantidade || !decimais) return interaction.channel.send(":x: | Você não informou a quantidade de 1 a 1000")
if (dec === "00") dec++;
if (quantidade * 100 > 1000 || quantidade === 0) return interaction.channel.send(`:x: | Você so pode apagar de 1 a 1000 mensagens`)
//Logica
interaction.reply({ content: `<a:azu_carregando:1122709454291488850> | Apagando...`})
for (i = 1; i <= decimais[0]; i++) {
if (decimais === 0) break;
if (Break === true) break;
await interaction.channel.bulkDelete(`100`).then(clearned => {
    if (clearned.size === 0) Break = true
    clearnedSize = Number(clearnedSize + clearned.size);
})
}

await interaction.channel.bulkDelete(`${dec}`).then(clearned => {
    console.log(clearned.size)
    clearnedSize = Number(clearnedSize + clearned.size);
})


interaction.channel.send({
    content: `Pronto! Apaguei ${clearnedSize} mensagens`
}).then(msg => {
setTimeout(() => {
msg.delete()
}, 10000)
})
    }
}