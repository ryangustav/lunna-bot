const Discord = require("discord.js");
const word = require('@andsfonseca/palavras-pt-br').Word;
module.exports = {
    data: new Discord.SlashCommandBuilder()
        .setName("forca")
        .setDescription("「🎉」Jogue o jogo da forca!")
        .setDMPermission(false),
    async execute(interaction, client) {
const palavra = word.getRandomWord()
const palavra_letra = palavra.split('')
let letras = ''
let lines = ''
let tentativas = 0;
let maximo = 6;
let letras_erradas = ' '
let i = 0

while (i < palavra_letra.length) {
i++
lines += '-'

}

function testar_letra(letra) {
const teste = palavra_letra.find(l => l.normalize('NFD').replace(/[\u0300-\u036F]/g, '') === letra.normalize('NFD').replace(/[\u0300-\u036F]/g, ''))
const teste2 = teste ? true : false
if (teste2 === false){
letras_erradas += `${letra} `
return teste ? true : false
}
if (teste2 === true){
const a = palavra_letra.findIndex(l => l.normalize('NFD').replace(/[\u0300-\u036F]/g, '') === letra.normalize('NFD').replace(/[\u0300-\u036F]/g, ''));
palavra_letra[a] = '-'
const teste3 = palavra_letra.find(l => l.normalize('NFD').replace(/[\u0300-\u036F]/g, '') === letra.normalize('NFD').replace(/[\u0300-\u036F]/g, ''))
const teste4 = teste3 ? true : false
if (teste4 === true){
const a = palavra_letra.findIndex(l => l.normalize('NFD').replace(/[\u0300-\u036F]/g, '') === letra.normalize('NFD').replace(/[\u0300-\u036F]/g, ''));
palavra_letra[a] = '-'
lines = lines.split('');
lines[a] = letra;
lines = lines.toString().replace(',', '').replace(',', '').replace(',', '').replace(',', '')
    console.log(lines)
    }
lines = lines.split('');
lines[a] = letra;
lines = lines.toString().replace(',', '').replace(',', '').replace(',', '').replace(',', '')
}

return teste ? true : false;
}

function testar_palavra(palavras) {
if (palavras.normalize('NFD').replace(/[\u0300-\u036F]/g, '') === palavra.normalize('NFD').replace(/[\u0300-\u036F]/g, '')) {
return true
} else if (palavras.normalize('NFD').replace(/[\u0300-\u036F]/g, '') !== palavra.normalize('NFD').replace(/[\u0300-\u036F]/g, '')) {
return false
}
}




const row = new Discord.ActionRowBuilder()
.addComponents(
new Discord.ButtonBuilder()
.setCustomId('chutar')
.setLabel('Chutar letra')
.setStyle('Primary')
.setEmoji('<:lapizz:1111824334823112704>'),
new Discord.ButtonBuilder()
.setCustomId('chutar_palavra')
.setLabel('Chutar palavra')
.setStyle('Secondary')
.setEmoji('<:lapizz:1111824334823112704>')
)

const embed = new Discord.EmbedBuilder()
.setTitle(`${client.user.username} | Jogo da forca<:file:1052384025089687614>`)
.setColor(`#be00e8`)
.setDescription(`
<:lapizz:1111824334823112704> | Quantidade de letras: ${palavra_letra.length}
<:file:1052384025089687614> | Palavra: ${lines}`)
.addFields(
{
name: `Letras erradas:`,
value: `${letras_erradas} (${tentativas}/${maximo})`
}
)

interaction.channel.send({ embeds: [embed], components: [row]}).then(async msg => {
    const collector = interaction.channel.createMessageComponentCollector({ time: 300000 }) 
    collector.on('collect', async int => {
    if (int.message.id !== msg.id) return
if (int.customId === 'chutar') {
    const modal = new Discord.ModalBuilder()
    .setCustomId('chuteModal')
	.setTitle(`${client.user.username} | Jogo da forca`);
    const time = new Discord.TextInputBuilder()
    .setCustomId('chute')
    .setRequired(true)
    .setMaxLength(1)
    .setMinLength(1)
    .setLabel(`Chute uma letra`)
    .setStyle(Discord.TextInputStyle.Short);
    const firstActionRow = new Discord.ActionRowBuilder().addComponents(time);
    modal.addComponents(firstActionRow);
    await int.showModal(modal);
}
if (int.customId === 'chutar_palavra') {
    const modal = new Discord.ModalBuilder()
    .setCustomId('chutePalavraModal')
	.setTitle(`${client.user.username} | Jogo da forca`);
    const time = new Discord.TextInputBuilder()
    .setCustomId('chute_palavra')
    .setRequired(true)
    .setMaxLength(5)
    .setMinLength(5)
    .setLabel(`Chute um qual a palavra`)
    .setStyle(Discord.TextInputStyle.Short);
    const firstActionRow = new Discord.ActionRowBuilder().addComponents(time);
    modal.addComponents(firstActionRow);
    await int.showModal(modal);
}
    })


    client.on('interactionCreate', inte => {
        if (inte.isModalSubmit()) {


 if (inte.customId === 'chutePalavraModal') {

const palavras = inte.fields.getTextInputValue("chute_palavra");
const testess = testar_palavra(palavras) 


if (testess === true) {
    inte.deferUpdate()
    const row = new Discord.ActionRowBuilder()
    .addComponents(
    new Discord.ButtonBuilder()
    .setCustomId('chutar')
    .setLabel('Chutar letra')
    .setDisabled(true)
    .setStyle('Primary')
    .setEmoji('<:lapizz:1111824334823112704>'),
    new Discord.ButtonBuilder()
    .setCustomId('chutar_palavra')
    .setLabel('Chutar palavra')
    .setDisabled(true)
    .setStyle('Secondary')
    .setEmoji('<:lapizz:1111824334823112704>')
    )
    
    const embed = new Discord.EmbedBuilder()
    .setTitle(`${client.user.username} | Jogo da forca<:file:1052384025089687614>`)
    .setColor(`#be00e8`)
    .setDescription(`
    <:lapizz:1111824334823112704> | Quantidade de letras: ${palavra_letra.length}
    <:file:1052384025089687614> | Palavra: ${palavra}`)
    .addFields(
    {
    name: `Letras erradas:`,
    value: `${letras_erradas} (${tentativas}/${maximo})`
    },
    {
    name: `🎉 Você ganhou! 🎉`,
    value: ` `
    }
    )
    
    msg.edit({ embeds: [embed], components: [row]})

} else if (testess === false) {
inte.reply({ content: `<:naoJEFF:1109179756831854592> | A palavra ${palavras} está errada!`})
}
 }




    if (inte.customId === 'chuteModal') {
        if (inte.message.id !== msg.id) return
        inte.deferUpdate()
        let letra = inte.fields.getTextInputValue("chute");
        let verify = testar_letra(letra)
    if (verify === false) tentativas++;
    if (tentativas === maximo) {
    const row = new Discord.ActionRowBuilder()
    .addComponents(
    new Discord.ButtonBuilder()
    .setCustomId('chutar')
    .setLabel('Chutar letra')
    .setDisabled(true)
    .setStyle('Primary')
    .setEmoji('<:lapizz:1111824334823112704>'),
    new Discord.ButtonBuilder()
    .setCustomId('chutar_palavra')
    .setLabel('Chutar palavra')
    .setDisabled(true)
    .setStyle('Secondary')
    .setEmoji('<:lapizz:1111824334823112704>')
    )
    
    const embed = new Discord.EmbedBuilder()
    .setTitle(`${client.user.username} | Jogo da forca<:file:1052384025089687614>`)
    .setColor(`#be00e8`)
    .setDescription(`
    <:lapizz:1111824334823112704> | Quantidade de letras: ${palavra_letra.length}
    <:file:1052384025089687614> | Palavra: ${lines}`)
    .addFields(
    {
    name: `Letras erradas:`,
    value: `${letras_erradas} (${tentativas}/${maximo})`
    },
    {
    name: `<:naoJEFF:1109179756831854592> Você perdeu <:naoJEFF:1109179756831854592>`,
    value: ` `
    }
    )
    
    msg.edit({ embeds: [embed], components: [row]})
    return
    }
    
    
    
    const row = new Discord.ActionRowBuilder()
    .addComponents(
    new Discord.ButtonBuilder()
    .setCustomId('chutar')
    .setLabel('Chutar letra')
    .setStyle('Primary')
    .setEmoji('<:lapizz:1111824334823112704>'),
    new Discord.ButtonBuilder()
    .setCustomId('chutar_palavra')
    .setLabel('Chutar palavra')
    .setStyle('Secondary')
    .setEmoji('<:lapizz:1111824334823112704>')
    )
    
    const embed = new Discord.EmbedBuilder()
    .setTitle(`${client.user.username} | Jogo da forca<:file:1052384025089687614>`)
    .setColor(`#be00e8`)
    .setDescription(`
    <:lapizz:1111824334823112704> | Quantidade de letras: ${palavra_letra.length}
    <:file:1052384025089687614> | Palavra: ${lines}`)
    .addFields(
    {
    name: `Letras erradas:`,
    value: `${letras_erradas} (${tentativas}/${maximo})`
    }
    )
    
    msg.edit({ embeds: [embed], components: [row]})
        }   
    }

    })
})



    },
};