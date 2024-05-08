const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require('discord.js');
const LunarModel = require("../../database/schema/coins_database.js");
const dailyCollect = require('../../database/schema/daily_schema.js');
const transactionsModel = require('../../database/schema/transactions.js')
const tigrin = ['<:SpecialRoles:1055063301148639252>', '<:gold_donator:1053256617518440478>', '<:gold_donator:1053256617518440478>', '🍎', '🍐', '🍇', '🍎', '🍐', '🍇', '🍎', '🍐', '🍇' ];


module.exports = {
    data: new SlashCommandBuilder()
        .setName("tigrin")
        .setDescription("「💰」Jogue o jogo do tigrinho")
        .setDMPermission(false)
        .addNumberOption(option => 
            option
            .setName("valor")
            .setDescription("Qual valor que você ira apostar?")
            .setRequired(true)
        ),
    async execute(interaction, client) {
        const valor_base = interaction.options.getNumber('valor');
        let valor = valor_base;
        const daily = await dailyCollect.findOne({ user_id: interaction.user.id });
        const lunar = await LunarModel.findOne({ user_id: interaction.user.id });
    
        if (!daily || daily.daily_collected === false) return interaction.reply({ content: `<:naoJEFF:1109179756831854592> | Você precisa coletar seu daily antes, usando </daily:1237466106093113434>` })
        if (!lunar || lunar.coins < valor) return interaction.reply({ content: `<:naoJEFF:1109179756831854592> | Você não tem lunar coins o suficiente para fazer esta aposta!`})
        if (valor < 50) return interaction.reply({ content: '<:naoJEFF:1109179756831854592> | Valor mínimo para apostar é 50!', ephemeral: true });
    
        
        lunar.coins -= Math.floor(valor);
        lunar.save();
        let multiply = {
        SpecialRole: 10.00,
        GoldDonator: 5.00,
        Other: 1.25
        }
        let winCount = 0;
        const tigrin_random = []
        for (i = 0; i < 9; i++) {
        const tigre = Math.floor(Math.random() * tigrin.length)
        tigrin_random.push(tigrin[tigre]);
        }
        const winningCombinations = [
            // Rows
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
          
            // Columns
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
          
            // Diagonals
            [0, 4, 8],
            [2, 4, 6]
          ];
          
          let isWinner = false;
          let winningSymbol = ''
          for (const combination of winningCombinations) {
            if (tigrin_random[combination[0]] === tigrin_random[combination[1]] && tigrin_random[combination[1]] === tigrin_random[combination[2]]) {
              isWinner = true;
              winningSymbol = tigrin_random[combination[0]];
              winCount++
            // Stop checking if a winner is found
            }
          }
if (winningSymbol === '<:SpecialRoles:1055063301148639252>') {
multiply = multiply.SpecialRole  * winCount;
valor = valor * multiply;
lunar.coins += Math.floor(valor);
} else if (winningSymbol === '<:gold_donator:1053256617518440478>') {
multiply = multiply.GoldDonator  * winCount;
valor = valor * multiply;
lunar.coins += Math.floor(valor);
} else if (isWinner === true) {
multiply = multiply.Other * winCount
valor = valor * multiply;
lunar.coins += Math.floor(valor);
} else if (isWinner === false) {
multiply = 1.00
}

lunar.save()
const row = new ActionRowBuilder();
const button = new ButtonBuilder()
.setCustomId(`Play-again`)
.setLabel('Jogar novamente')
.setEmoji('🔄')
.setStyle('Primary');
row.addComponents(button);

        const embed = new EmbedBuilder()
        .setTitle(client.user.username + ' | Tigrin Game🍎')
        .setColor("#be00e8")
        .setDescription(`
<:Money:1051978255827222590> | Ganhos: **${Math.floor(valor)}** Lunar coins
<:gold_donator:1053256617518440478> | Multiplicador: ${winningSymbol} ${multiply.toFixed(2)}
↘️=====↙️
${tigrin_random[0]} ${tigrin_random[1]} ${tigrin_random[2]}
${tigrin_random[3]} ${tigrin_random[4]} ${tigrin_random[5]}
${tigrin_random[6]} ${tigrin_random[7]} ${tigrin_random[8]}
↗️=====↖️`);

const message = await interaction.reply({ embeds: [embed], components: [row]}).then(async msg => {
const collector = interaction.channel.createMessageComponentCollector({ time: 300000 }) 
collector.on('collect', async int => {
int.deferUpdate();
if (int.user.id !== interaction.user.id) return
if (valor === 0 ) valor = valor_base;

function random() {

    lunar.coins -= Math.floor(valor);
    lunar.save();
    let multiply = {
        SpecialRole: 10.00,
        GoldDonator: 5.00,
        Other: 1.25
    }
    let winCount = 0;
    const tigrin_random = []
    for (i = 0; i < 9; i++) {
    const tigre = Math.floor(Math.random() * tigrin.length)
    tigrin_random.push(tigrin[tigre]);
    }
    const winningCombinations = [
        // Rows
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
      
        // Columns
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
      
        // Diagonals
        [0, 4, 8],
        [2, 4, 6]
      ];
      
      let isWinner = false;
      let winningSymbol = ''
      for (const combination of winningCombinations) {
        if (tigrin_random[combination[0]] === tigrin_random[combination[1]] && tigrin_random[combination[1]] === tigrin_random[combination[2]]) {
          isWinner = true;
          winningSymbol = tigrin_random[combination[0]];
          winCount++
        // Stop checking if a winner is found
        }
      }




      if (winningSymbol === '<:SpecialRoles:1055063301148639252>') {
        multiply = multiply.SpecialRole  * winCount;
        valor = valor * multiply;
lunar.coins += Math.floor(valor);
lunar.save();
        } else if (winningSymbol === '<:gold_donator:1053256617518440478>') {
        multiply = multiply.GoldDonator  * winCount;
        valor = valor * multiply;
        lunar.coins += Math.floor(valor);
        lunar.save();
        } else if (isWinner === true) {
        multiply = multiply.Other * winCount
        valor = valor * multiply;
lunar.coins += Math.floor(valor);
lunar.save();
        } else if (isWinner === false) {
        multiply = 1.00

        }

return { multiply, winningSymbol, tigrin_random }
}

const game = await random();

const embed = new EmbedBuilder()
.setTitle(client.user.username + ' | Tigrin Game🍎')
.setColor("#be00e8")
.setDescription(`
<:Money:1051978255827222590> | Ganhos: **${Math.floor(valor * game.multiply)}** Lunar coins
<:gold_donator:1053256617518440478> | Multiplicador: ${game.winningSymbol} ${game.multiply.toFixed(2)}
↘️=====↙️
${game.tigrin_random[0]} ${game.tigrin_random[1]} ${game.tigrin_random[2]}
${game.tigrin_random[3]} ${game.tigrin_random[4]} ${game.tigrin_random[5]}
${game.tigrin_random[6]} ${game.tigrin_random[7]} ${game.tigrin_random[8]}
↗️=====↖️`);

interaction.editReply({embeds: [embed] })
})
collector.on('end', int => {

    const row = new ActionRowBuilder();
    const button = new ButtonBuilder()
    .setCustomId(`Play-again`)
    .setLabel('Jogar novamente')
    .setEmoji('🔄')
    .setDisabled(true)
    .setStyle('Primary');
    row.addComponents(button);

    const embed = new EmbedBuilder()
.setTitle(client.user.username + ' | Tigrin Game🍎')
.setColor("#be00e8")
.setDescription(`
<:Money:1051978255827222590> | Ganhos: **${Math.floor(valor * multiply)}** Lunar coins
<:gold_donator:1053256617518440478> | Multiplicador: ${winningSymbol} ${multiply.toFixed(2)}

<:bl_info:1053256877896634439> Para jogar novamente use </tigrin:1237842905876398212>
`);

interaction.editReply({embeds: [embed], components: [row] })
})
})
}
}