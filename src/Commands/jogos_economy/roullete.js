const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require('discord.js');
const LunarModel = require("../../database/schema/coins_database.js");
const dailyCollect = require('../../database/schema/daily_schema.js');
const transactionsModel = require('../../database/schema/transactions.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("roullete")
        .setDescription("「💰」Jogue o roullete")
        .setDMPermission(false)
        .addNumberOption(option => 
            option
            .setName("valor")
            .setDescription("Qual valor que você ira apostar?")
            .setRequired(true)
        )
        .addStringOption(option => 
            option
            .setName("aposta")
            .setDescription("Qual sua aposta?")
            .addChoices(
{ name: 'Preto', value: 'black'},
{ name: 'Vermelho', value: 'red'},
{ name: 'Impares', value: 'impares'},
{ name: 'Pares', value: 'pares'},
{ name: '1-12', value: '1-12'},
{ name: '13-24', value: '13-24'},
{ name: '25-36', value: '25-36'},
            )
            .setRequired(true)
        ),
    async execute(interaction, client) {
        
        const valor = interaction.options.getNumber('valor');
        const aposta = interaction.options.getString('aposta');
        const daily = await dailyCollect.findOne({ user_id: interaction.user.id });
        const lunar = await LunarModel.findOne({ user_id: interaction.user.id });
        const transactions_payer = await transactionsModel.findOne({ user_id: interaction.user.id })
        const id = Math.floor(Math.random() * (999999999 - 111111111 + 1) + 111111111)
        const timestamp = Math.floor(Date.now() / 1000);

        if (!daily || daily.daily_collected === false) return interaction.reply({ content: `<:naoJEFF:1109179756831854592> | Você precisa coletar seu daily antes, usando </daily:1237466106093113434>` })
        if (!lunar || lunar.coins < valor) return interaction.reply({ content: `<:naoJEFF:1109179756831854592> | Você não tem lunar coins o suficiente para fazer esta aposta!`})
        if (valor < 50) return interaction.reply({ content: '<:naoJEFF:1109179756831854592> | Valor mínimo para apostar é 50!', ephemeral: true });

        
        lunar.coins -= Math.floor(valor);
        lunar.save();
        let odd_even;
        let black_red;
        let intervalo;
        let multiply = 1.00
        const random_number = Math.floor(Math.random() * (36 - 1 + 1)) + 1

        if (random_number % 2 === 0) {
        black_red = 'red'
        odd_even = 'par'
        } else {
        black_red = 'black'
        odd_even = 'impar'
        }
        if (random_number < 12 && random_number > 1) intervalo = '1-12';
        if (random_number < 24 && random_number > 13) intervalo = '13-24';
        if (random_number < 36 && random_number > 25) intervalo = '25-36';

        
        const embed = new EmbedBuilder()
        .setTitle(`${client.user.username} | Roullete game`)
        .setColor(`#be00e8`)
        .setDescription(`<a:azu_carregando:1122709454291488850> O resultado saira em 30 segundos! <a:azu_carregando:1122709454291488850>`)
        interaction.reply({ embeds: [embed] })
 


        setTimeout(() => {
            let resultado = testar_aposta(aposta)

           const embed = new EmbedBuilder()
           .setTitle(`${client.user.username} | Roullete game`)
           .setColor(`#be00e8`)
           .setDescription(`
**Você ${resultado === true ? '🎉ganhou🎉' : 'perdeu'}**
💸 | Valor apostado: ${valor}
💎 | Aposta: ${aposta}
<:gold_donator:1053256617518440478> | Multiplicador: ${multiply}
           `)
           interaction.channel.send({ embeds: [embed], content: `${interaction.user}`})
if (resultado === true) {
    lunar.coins += Math.floor(valor * multiply);
    lunar.save();
    if (!transactions_payer) {
        transactionsModel.create({ user_id: interaction.user.id, transactions: [{ id: id, timestamp: timestamp, mensagem: `Ganhou ${valor * multiply.toFixed(2)} jogando roullete`}], transactions_ids: [id]})
        } else {
        transactions_payer.transactions.push({id: id, timestamp: timestamp, mensagem: `Ganhou ${valor * multiply.toFixed(2)} jogando roullete`})
        transactions_payer.transactions_ids.push(id)
        transactions_payer.save()
        }
} else {
    if (!transactions_payer) {
        transactionsModel.create({ user_id: interaction.user.id, transactions: [{ id: id, timestamp: timestamp, mensagem: `Perdeu ${valor} jogando roullete`}], transactions_ids: [id]})
        } else {
        transactions_payer.transactions.push({id: id, timestamp: timestamp, mensagem: `Perdeu ${valor} jogando rollete`})
        transactions_payer.transactions_ids.push(id)
        transactions_payer.save()
        }
}
        }, 30000)

        function testar_aposta(aposta) {
            const apostasValidas = [odd_even, black_red, intervalo];
            if (apostasValidas.includes(aposta) === true) {
            if (aposta === 'black' || aposta === 'red') multiply = 1.50;
            if (aposta === 'pares' || aposta === 'impares') multiply = 1.25;
            if (aposta === '1-12' || aposta === '13-24' || aposta === '25-36') multiply = 2.00;
            }
            return apostasValidas.includes(aposta);
        }

}
}