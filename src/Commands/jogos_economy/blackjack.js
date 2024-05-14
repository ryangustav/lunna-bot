const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require('discord.js');
const LunarModel = require("../../database/schema/coins_database.js");
const dailyCollect = require('../../database/schema/daily_schema.js');
const transactionsModel = require('../../database/schema/transactions.js')
const types = [ 'clubes', 'diamante', 'coração', 'espadas' ]
const cards = [ 'A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', '7', '8', '9', '10', 'J', 'Q', 'K'];
const types_images = ["♥", "♦", "♠", "♣"]


module.exports = {
    data: new SlashCommandBuilder()
        .setName("blackjack")
        .setDescription("「💰」Jogue mines")
        .setDMPermission(false)
        .addNumberOption(option => 
            option
            .setName("valor")
            .setDescription("Qual valor que você ira apostar?")
            .setRequired(true)
        ),
    async execute(interaction, client, interaction_id) {
        interaction.deferReply();
        const valor = interaction.options.getNumber('valor');
        const daily = await dailyCollect.findOne({ user_id: interaction.user.id });
        const lunar = await LunarModel.findOne({ user_id: interaction.user.id });
    
        if (!daily || daily.daily_collected === false) return interaction.reply({ content: `<:naoJEFF:1109179756831854592> | Você precisa coletar seu daily antes, usando </daily:1237466106093113434>` })
        if (!lunar || lunar.coins < valor) return interaction.reply({ content: `<:naoJEFF:1109179756831854592> | Você não tem lunar coins o suficiente para fazer esta aposta!`})
        if (valor < 50) return interaction.reply({ content: '<:naoJEFF:1109179756831854592> | Valor mínimo para apostar é 50!', ephemeral: true });
    
        
        lunar.coins -= Math.floor(valor);
        lunar.save();
        const dealer_cards = []
        const user_cards = []
        let dealer_soma = 0
        let user_soma = 0
        let message_end = '';
        let win_lose = '';

       for (i = 0; i < 2; i++) {
       const random_dealer_type = Math.floor(Math.random() * types.length);
       const random_user_type = Math.floor(Math.random() * types.length);
       const random_dealer = Math.floor(Math.random() * types.length);
       const random_user = Math.floor(Math.random() * types.length);
       let dealer = Number(cards[random_dealer]);
       let user = Number(cards[random_user])


       if (cards[random_dealer] === 'J' || cards[random_dealer] === 'Q' || cards[random_dealer] === 'K') dealer = 10
       if (cards[random_user] === 'J' || cards[random_user] === 'Q' || cards[random_user] === 'K') user = 10
       if (cards[random_dealer] === 'A') dealer = 1
       if (cards[random_user] === 'A') user = 1


       dealer_soma = dealer_soma + dealer;
       user_soma = user_soma + user;

       dealer_cards.push(`${cards[random_dealer]}${types_images[random_dealer_type]}`)
       user_cards.push(`${cards[random_user]}${types_images[random_user_type]}`)
       }

//Funções

async function dealer_push() {
if (dealer_soma > 14) return null
if (dealer_soma < 5) {

   for (i = 0; i < 2; i++) {
   const random_dealer_type = Math.floor(Math.random() * types.length);
   const random_dealer = Math.floor(Math.random() * types.length);
   let dealer = Number(cards[random_dealer]);


   if (cards[random_dealer] === 'J' || cards[random_dealer] === 'Q' || cards[random_dealer] === 'K') dealer = 10
   if (cards[random_dealer] === 'A') dealer = 1



   dealer_soma += dealer;

   dealer_cards.push(`${cards[random_dealer]}${types_images[random_dealer_type]}`)
  
   }

} else {
    const random_dealer_type = Math.floor(Math.random() * types.length);
    const random_dealer = Math.floor(Math.random() * types.length);
    let dealer = Number(cards[random_dealer]);
 
 
    if (cards[random_dealer] === 'J' || cards[random_dealer] === 'Q' || cards[random_dealer] === 'K') dealer = 10
    if (cards[random_dealer] === 'A') dealer = 1
 
 
 
    dealer_soma += dealer;
 
    dealer_cards.push(`${cards[random_dealer]}${types_images[random_dealer_type]}`)
    
}
}
async function end_game() {

if (user_soma < dealer_soma && dealer_soma < 21){
message_end = "<:naoJEFF:1109179756831854592> Que azar!! Você perdeu <:naoJEFF:1109179756831854592>"
win_lose = 'lose'
}
if (user_soma > dealer_soma && user_soma < 21) { 
message_end = "🎉 Nossa que sorte!! Você ganhou 🎉"
win_lose = 'win'
}
if (user_soma === dealer_soma && dealer_soma < 21) { 
message_end = "<:world_setad:1108434715419103373> Deu empate! <:world_setae:1108434753478217918>"
win_lose = 'bet'
}
if (user_soma > 21) {
message_end = "<:naoJEFF:1109179756831854592> Que azar!! Você perdeu <:naoJEFF:1109179756831854592>"
win_lose = 'lose'
}
if (dealer_soma > 21) {
message_end = "🎉 Nossa que sorte!! Você ganhou 🎉"
win_lose = 'win'
}
if (user_soma === 21) { 
message_end = "🎉 Parabéns!! 21 perfeito! 🎉"
win_lose = 'double'
}
if (dealer_soma === 21) {
message_end = "<:naoJEFF:1109179756831854592> Que azar!! O dealer fez 21 <:naoJEFF:1109179756831854592>"
win_lose = 'lose'
}
}



//Embed
       const row2 = new ActionRowBuilder();
       const button = new ButtonBuilder()
       .setCustomId(`Hit`)
       .setLabel('Pegar uma')
       .setStyle('Primary');
       const button2 = new ButtonBuilder()
       .setCustomId(`Hit_double`)
       .setLabel('Pegar duas')
       .setStyle('Secondary');
       const button3 = new ButtonBuilder()
       .setCustomId(`Parar`)
       .setLabel('Finalizar jogo')
       .setStyle('Success');
       row2.addComponents(button, button2, button3);

       const embed = new EmbedBuilder()
       .setTitle(client.user.username + ' | Blackjack Game💎')
       .setColor("#be00e8")
       .setDescription(`
<:Money:1051978255827222590> | Aposta: ${valor}
       `)
       .addFields(
    {
name: `**Sua mão**`,
value: `**${user_cards}** (${user_soma})`,
inline: false
    },
    {
name: `**Dealer**`,
value: `||${dealer_cards}|| (${dealer_soma})`,
inline: false
    }
);

     const message = await interaction.channel.send({ embeds: [embed], components: [row2] }).then(msg => {
     

     const collector = interaction.channel.createMessageComponentCollector();

     collector.on('collect', async int => {
    if (int.message.id !== msg.id) return
    if (int.user.id !== interaction.user.id) return;
    int.deferUpdate();
    if (int.customId === 'Hit') {
        const random_user_type = Math.floor(Math.random() * types.length);
        const random_user = Math.floor(Math.random() * types.length);
        let user = Number(cards[random_user]);
     
     
        if (cards[random_user] === 'J' || cards[random_user] === 'Q' || cards[random_user] === 'K') user = 10
        if (cards[random_user] === 'A') user = 1
     
     
     
        user_soma = user_soma + user;
     
        user_cards.push(`${cards[random_user]}${types_images[random_user_type]}`) 
        await dealer_push()

        const embed = new EmbedBuilder()
        .setTitle(client.user.username + ' | Blackjack Game💎')
        .setColor("#be00e8")
        .setDescription(`
 <:Money:1051978255827222590> | Aposta: ${valor}
        `)
        .addFields(
     {
 name: `**Sua mão**`,
 value: `**${user_cards}** (${user_soma})`,
 inline: false
     },
     {
 name: `**Dealer**`,
 value: `||${dealer_cards}|| (${dealer_soma})`,
 inline: false
     }
 );
 
      const message = msg.edit({ embeds: [embed], components: [row2] })


    } else     if (int.customId === 'Hit_double') {
        for (i = 0; i < 2; i++) {
        const random_user_type = Math.floor(Math.random() * types.length);
        const random_user = Math.floor(Math.random() * types.length);
        let user = Number(cards[random_user]);
     
     
        if (cards[random_user] === 'J' || cards[random_user] === 'Q' || cards[random_user] === 'K') user = 10
        if (cards[random_user] === 'A') user = 1
     
     
     
        user_soma = user_soma + user;
     
        user_cards.push(`${cards[random_user]}${types_images[random_user_type]}`) 
        }
        await dealer_push()

        const embed = new EmbedBuilder()
        .setTitle(client.user.username + ' | Blackjack Game💎')
        .setColor("#be00e8")
        .setDescription(`
 <:Money:1051978255827222590> | Aposta: ${valor}
        `)
        .addFields(
     {
 name: `**Sua mão**`,
 value: `**${user_cards}** (${user_soma})`,
 inline: false
     },
     {
 name: `**Dealer**`,
 value: `||${dealer_cards}|| (${dealer_soma})`,
 inline: false
     }
 );
 
      const message = msg.edit({ embeds: [embed], components: [row2] })


    } else if (int.customId === 'Parar') {
    if (dealer_soma < 14) dealer_push()
     await end_game();
            if (win_lose === "win") {
                if (!transactions_payer) {
                    transactionsModel.create({ user_id: interaction.user.id, transactions: [{ id: id, timestamp: timestamp, mensagem: `Ganhou ${valor * 2} jogando blackjack`}], transactions_ids: [id]})
                    } else {
                    transactions_payer.transactions.push({id: id, timestamp: timestamp, mensagem: `Ganhou ${valor * 2} jogando blackjack`})
                    transactions_payer.transactions_ids.push(id)
                    transactions_payer.save()
        }
        lunar.coins += Math.floor(valor * 2);
        lunar.save();
     } else if (win_lose === "bet") {
        if (!transactions_payer) {
            transactionsModel.create({ user_id: interaction.user.id, transactions: [{ id: id, timestamp: timestamp, mensagem: `Empatou jogando blackjack e recebeu extorno de ${valor}`}], transactions_ids: [id]})
            } else {
            transactions_payer.transactions.push({id: id, timestamp: timestamp, mensagem: `Empatou jogando blackjack e recebeu extorno de ${valor}`})
            transactions_payer.transactions_ids.push(id)
            transactions_payer.save()
}
        lunar.coins += Math.floor(valor);
        lunar.save();
     } else if (win_lose === "double") {
        if (!transactions_payer) {
            transactionsModel.create({ user_id: interaction.user.id, transactions: [{ id: id, timestamp: timestamp, mensagem: `Ganhou ${valor * 3} jogando blackjack`}], transactions_ids: [id]})
            } else {
            transactions_payer.transactions.push({id: id, timestamp: timestamp, mensagem: `Ganhou ${valor * 3} jogando blackjack`})
            transactions_payer.transactions_ids.push(id)
            transactions_payer.save()
}
        lunar.coins += Math.floor(valor * 3);
        lunar.save();
     }

     const row2 = new ActionRowBuilder();
       const button = new ButtonBuilder()
       .setCustomId(`Hit`)
       .setLabel('Pegar uma')
       .setDisabled(true)
       .setStyle('Primary');
       const button2 = new ButtonBuilder()
       .setCustomId(`Hit_double`)
       .setLabel('Pegar duas')
       .setDisabled(true)
       .setStyle('Secondary');
       const button3 = new ButtonBuilder()
       .setCustomId(`Parar`)
       .setLabel('Finalizar jogo')
       .setDisabled(true)
       .setStyle('Success');
       row2.addComponents(button, button2, button3);

       const embed = new EmbedBuilder()
       .setTitle(client.user.username + ' | Blackjack Game💎')
       .setColor("#be00e8")
       .setDescription(`
<:Money:1051978255827222590> | Aposta: ${valor}
       `)
       .addFields(
    {
name: `**Sua mão**`,
value: `**${user_cards}** (${user_soma})`,
inline: false
    },
    {
name: `**Dealer**`,
value: `||${dealer_cards}|| (${dealer_soma})`,
inline: false
    },
    {
name: ` `,
value: `**${message_end}**`,
inline: false
    }
);

const message = await msg.edit({ embeds: [embed], components: [row2] })

    }
     })
    })



    
}
}