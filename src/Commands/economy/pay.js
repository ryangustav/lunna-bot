const { SlashCommandBuilder } = require("discord.js");
const LunarModel = require("../../database/schema/coins_database.js");
const dailyCollect = require('../../database/schema/daily_schema.js');
const transactionsModel = require('../../database/schema/transactions.js')
module.exports = {
    data: new SlashCommandBuilder()
        .setName("pay")
        .setDescription("「💰」Pague lunar coins")
        .setDMPermission(false)
        .addUserOption(option => 
            option
            .setName("user")
            .setDescription("Quem você ira pagar?")
            .setRequired(true)
        )
        .addNumberOption(option => 
            option
            .setName("valor")
            .setDescription("Qual valor que você ira enviar?")
            .setRequired(true)
        ),
    async execute(interaction, client) {
   //Definições
    const user = interaction.options.getUser('user');
    const valor = Number(interaction.options.getNumber('valor'));

    const daily_payer = await dailyCollect.findOne({ user_id: interaction.user.id });
    const daily_receiver = await dailyCollect.findOne({ user_id: user.id });
    const lunar_payer = await LunarModel.findOne({ user_id: interaction.user.id })
    const lunar_receiver = await LunarModel.findOne({ user_id: user.id })
    const transactions_payer = await transactionsModel.findOne({ user_id: interaction.user.id })
    const transactions_receiver = await transactionsModel.findOne({ user_id: user.id })
    const id = Math.floor(Math.random() * (999999999 - 111111111 + 1) + 111111111)
    const timestamp = Math.floor(Date.now() / 1000);

    //Verificações
    if (!daily_payer || daily_payer.daily_collected === false) return interaction.reply({ content: `<:naoJEFF:1109179756831854592> | Você precisa coletar seu daily antes, usando </daily:1237466106093113434>` })
    if (!daily_receiver || daily_receiver.daily_collected === false) return interaction.reply({ content: `<:naoJEFF:1109179756831854592> | O usuario precisa coletar o daily antes, usando </daily:1237466106093113434>` })
    if (!lunar_payer || lunar_payer.coins < valor) return interaction.reply({ content: `<:naoJEFF:1109179756831854592> | Você não tem lunar coins o suficiente para efetuar esse pagamento!`})
    if (valor < 10) return interaction.reply({ content: `<:naoJEFF:1109179756831854592> | Esse valor e invalido!`})
   
    if (!lunar_receiver) {
   await LunarModel.create({ user_id: user.id, coins: valor})
    lunar_payer.coins -= valor
    lunar_payer.save();
    } else {
    lunar_receiver.coins =+ valor
    lunar_receiver.save();
    lunar_payer.coins -= valor
    lunar_payer.save();
    }
    if (!transactions_payer) {
    transactionsModel.create({ user_id: interaction.user.id, transactions: [{ id: id, timestamp: timestamp, mensagem: `Enviou ${valor} para \`${user.username} (${user.id})\``}], transactions_ids: [id]})
    } else {
    transactions_payer.transactions.push({id: id, timestamp: timestamp, mensagem: `Enviou ${valor} para \`${user.username} (${user.id})\``})
    transactions_payer.transactions_ids.push(id)
    transactions_payer.save()
    }
    if (!transactions_receiver) {
    transactionsModel.create({ user_id: user.id, transactions: [{id: id, timestamp: timestamp, mensagem: `Recebeu ${valor} de \`${interaction.user.username} (${interaction.user.id})\``}], transactions_ids: [id]})
    } else {
    transactions_receiver.transactions.push({id: id, timestamp: timestamp, mensagem: `Enviou ${valor} para \`${user.username} (${user.id})\``})
    transactions_receiver.transactions_ids.push(id)
    transactions_receiver.save()
}
interaction.reply({ content: `<:gold_donator:1053256617518440478> | Pronto! ${interaction.user} você pagou ${valor} lunar coins para ${user}`})


    }
}