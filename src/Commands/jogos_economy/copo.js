const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require('discord.js');
const LunarModel = require("../../database/schema/coins_database.js");
const dailyCollect = require('../../database/schema/daily_schema.js');
const transactionsModel = require('../../database/schema/transactions.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("copo")
        .setDescription("「💰」Jogue o jogo do copo")
        .setDMPermission(false)
        .addNumberOption(option => 
            option
            .setName("valor")
            .setDescription("Qual valor que você ira apostar?")
            .setRequired(true)
        ),
    async execute(interaction, client) {
        //interaction.deferReply();
        const valor = interaction.options.getNumber('valor');
        const daily = await dailyCollect.findOne({ user_id: interaction.user.id });
        const lunar = await LunarModel.findOne({ user_id: interaction.user.id });
    
        if (!daily || daily.daily_collected === false) return interaction.reply({ content: `<:naoJEFF:1109179756831854592> | Você precisa coletar seu daily antes, usando </daily:1237466106093113434>` })
        if (!lunar || lunar.coins < valor) return interaction.reply({ content: `<:naoJEFF:1109179756831854592> | Você não tem lunar coins o suficiente para fazer esta aposta!`})
        if (valor < 50) return interaction.reply({ content: '<:naoJEFF:1109179756831854592> | Valor mínimo para apostar é 50!', ephemeral: true });
    
        
        lunar.coins -= Math.floor(valor);
        lunar.save();
        const copos = []
        const ids = []
        let bolinha = false
const bolinhas = {
bolinha0: '<:soda:1239315444163149865>',
bolinha1: '<:soda:1239315444163149865>',
bolinha2: '<:soda:1239315444163149865>'
}
for (i = 0; i < 3; i++) {
const cup_random = Math.floor(Math.random() * 3)


if (cup_random === 2 && bolinha === false){
bolinha = true
copos.push(true)
}
if (i === 2 && bolinha === false) return copos.push(true)  
  
copos.push(false)
        }
for (i = 0; i < 3; i++) {
ids.push(`bolinha${i}-${copos[i]}`)

}


        const row = new ActionRowBuilder()
        .addComponents(
        new ButtonBuilder()
        .setCustomId(`bolinha0-${copos[0]}`)
        .setLabel(`1`)
        .setStyle(`Primary`),
        new ButtonBuilder()
        .setCustomId(`bolinha1-${copos[1]}`)
        .setLabel(`2`)
        .setStyle(`Primary`),
        new ButtonBuilder()
        .setCustomId(`bolinha2-${copos[2]}`)
        .setLabel(`3`)
        .setStyle(`Primary`)
        )

        const embed = new EmbedBuilder()
        .setTitle(`${client.user.username} | Jogo do copo<:soda:1239315444163149865>`)
        .setColor(`#be00e8`)
        .setDescription(`
⚾Onde esta a bolinha?⚾
> ${bolinhas.bolinha0} ${bolinhas.bolinha1} ${bolinhas.bolinha2}
        `)

    interaction.channel.send({ embeds: [embed], components: [row]}).then(msg => {
    const collector = msg.channel.createMessageComponentCollector()

    collector.on('collect', int => {
    const trues = int.customId.split('-')

    let bolinhas_string = ``
    if (trues[1] === 'true') {

for (i = 0; i < 3; i++) {
const game = ids[i];
const game_split = game.split('-');
if (game_split[1] === 'true') bolinhas_string += '⚾'
if (game_split[1] === 'false') {
bolinhas_string += '<:soda:1239315444163149865>'

}
}


    const copo = trues[0]
    const row = new ActionRowBuilder()
    .addComponents(
    new ButtonBuilder()
    .setCustomId(`bolinha0-${copos[0]}`)
    .setLabel(`1`)
    .setDisabled(true)
    .setStyle(`Primary`),
    new ButtonBuilder()
    .setCustomId(`bolinha1-${copos[1]}`)
    .setLabel(`2`)
    .setDisabled(true)
    .setStyle(`Primary`),
    new ButtonBuilder()
    .setCustomId(`bolinha2-${copos[2]}`)
    .setLabel(`3`)
    .setDisabled(true)
    .setStyle(`Primary`)
    )

    const embed = new EmbedBuilder()
    .setTitle(`${client.user.username} | Jogo do copo<:soda:1239315444163149865>`)
    .setColor(`#be00e8`)
    .setDescription(`
**Você ganhou**
> ${bolinhas_string}
<:gold_donator:1053256617518440478> Valor apostado: ${valor}
<:Money:1051978255827222590> Ganhos: ${valor * 2}
    `)
lunar.coins += Math.floor(valor * 2);
lunar.save();
msg.edit({ embeds: [embed], components: [row]})

    }
if (trues[1] === 'false') {
    let copo_certo;
    if (trues[0] === 'bolinha0') resposta = 1;
    if (trues[0] === 'bolinha1') resposta = 2;
    if (trues[0] === 'bolinha2') resposta = 3;
    for (i = 0; i < 3; i++) {
        const game = ids[i];
        const game_split = game.split('-');
        if (game_split[1] === 'true') {
        bolinhas_string += '⚾'
        copo_certo = i + 1;
        }
        if (game_split[1] === 'false') {
        bolinhas_string += '<:soda:1239315444163149865>'
        
        }
        }
        
        
            const copo = trues[0]
            const row = new ActionRowBuilder()
            .addComponents(
            new ButtonBuilder()
            .setCustomId(`bolinha0-${copos[0]}`)
            .setLabel(`1`)
            .setDisabled(true)
            .setStyle(`Primary`),
            new ButtonBuilder()
            .setCustomId(`bolinha1-${copos[1]}`)
            .setLabel(`2`)
            .setDisabled(true)
            .setStyle(`Primary`),
            new ButtonBuilder()
            .setCustomId(`bolinha2-${copos[2]}`)
            .setLabel(`3`)
            .setDisabled(true)
            .setStyle(`Primary`)
            )
        
            const embed = new EmbedBuilder()
            .setTitle(`${client.user.username} | Jogo do copo<:soda:1239315444163149865>`)
            .setColor(`#be00e8`)
            .setDescription(`
        **Você perdeu**
        > ${bolinhas_string}
        <:soda:1239315444163149865> Copo certo: ${copo_certo}
        <:soda:1239315444163149865> Você respondeu: ${resposta}
        <:Money:1051978255827222590> Percas: ${valor}
            `)
        msg.edit({ embeds: [embed], components: [row]})        
}
    })
    })
    }
}