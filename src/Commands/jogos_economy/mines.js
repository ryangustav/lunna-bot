const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require('discord.js');
const LunarModel = require("../../database/schema/coins_database.js");
const dailyCollect = require('../../database/schema/daily_schema.js');
const transactionsModel = require('../../database/schema/transactions.js')



function parseButtonId(id) {
    const isBomb = id.split('-')[3];
    return isBomb === 'true';
  }

module.exports = {
    data: new SlashCommandBuilder()
        .setName("mines")
        .setDescription("「💰」Jogue mines")
        .setDMPermission(false)
        .addNumberOption(option => 
            option
            .setName("valor")
            .setDescription("Qual valor que você ira enviar?")
            .setRequired(true)
        ),
    async execute(interaction, client) {
        const valor = interaction.options.getNumber('valor');
        const daily = await dailyCollect.findOne({ user_id: interaction.user.id });
        const lunar = await LunarModel.findOne({ user_id: interaction.user.id });
    
        if (!daily || daily.daily_collected === false) return interaction.reply({ content: `<:naoJEFF:1109179756831854592> | Você precisa coletar seu daily antes, usando </daily:1237466106093113434>` })
        if (!lunar || lunar.coins < valor) return interaction.reply({ content: `<:naoJEFF:1109179756831854592> | Você não tem lunar coins o suficiente para fazer esta aposta!`})
        if (valor < 50) return interaction.reply({ content: '<:naoJEFF:1109179756831854592> | Valor mínimo para apostar é 50!', ephemeral: true });
    
        
        lunar.coins -= Math.floor(valor);
        lunar.save();
        const buttonRows = [];
        const idsArray = []
        let totalMines = 0;
        let multiply = 1.00
        for (let i = 0; i < 4; i++) {
          const row = new ActionRowBuilder();
          for (let j = 0; j < 4; j++) {
            const randomId = Math.floor(Math.random() * 4);
            let id = false
            if (randomId === 2 && totalMines < 3) {
            totalMines++
            id = true
            }
            if (i === 4 && j === 4 && totalMines === 2) return id = true
            if (i === 3 && j === 3 && totalMines === 1) return id = true
            const button = new ButtonBuilder()
              .setCustomId(`button-${i}-${j}-${id}`)
              .setLabel(' ')
              .setEmoji('<:caixa:1051978207110377573>') 
              .setStyle('Primary');
              idsArray.push(`button-${i}-${j}-${id}-false`)
    
            row.addComponents(button);
          }
          buttonRows.push(row); 
        }
        const row2 = new ActionRowBuilder();
        const button = new ButtonBuilder()
        .setCustomId(`finalizar-9-9-9-9`)
        .setLabel('Finalizar jogo')
        .setEmoji('<:gold_donator:1053256617518440478>')
        .setStyle('Success');
        idsArray.push(`finalizar-9-9-9-9`)
        row2.addComponents(button);
        buttonRows.push(row2); 



        const embed = new EmbedBuilder()
          .setTitle(client.user.username + ' | Mines Game💣')
          .setColor("#be00e8")
          .setDescription(`
          Multiplicador: ${multiply.toFixed(2)}
          Ganhos: **${Math.floor(valor * multiply)}** Lunar coins
          `);
       
        const message = await interaction.reply({ embeds: [embed], components: buttonRows }).then(msg => {
    
        const collector = interaction.channel.createMessageComponentCollector();

        collector.on('collect', int => {
        int.deferUpdate()

        if (int.customId === "finalizar-9-9-9-9") {
            lunar.coins += Math.floor(valor * multiply);
            lunar.save();



            const rows = new ActionRowBuilder();
            const button = new ButtonBuilder()
            .setCustomId(`finalizar-9-9-9-9`)
            .setLabel('Finalizar jogo')
            .setEmoji('<:gold_donator:1053256617518440478>')
            .setDisabled(true)
            .setStyle('Success');
            idsArray.push(`finalizar-9-9-9-9`)
            rows.addComponents(button);



            const embed = new EmbedBuilder()
            .setTitle(client.user.username + ' | Mines Game💣')
            .setColor("#be00e8")
            .setDescription(`
            Multiplicador: ${multiply.toFixed(2)}
            Ganhos: **${Math.floor(valor * multiply)}** Lunar coins

            🎉Parabéns ${interaction.user}, você ganhou **${Math.floor(valor * multiply)}** Lunar coins🎉
            `);
            interaction.editReply({embeds: [embed], components: [rows] })
            return
        }
        const ids = int.customId.split('-')
        const otherRow = []
        const otherRow2 = []
      
        if (ids[3] === 'true') {
        const idsArray2 = []

        let id = 0;
        for (i = 0; i < 4; i++) {
        const row = new ActionRowBuilder();

        for (j = 0; j < 4; j++) {
     
          const isBombs = `${idsArray[id]}`
          const isBomb = isBombs.split('-')[3];

          let emoji = '<:gold_donator:1053256617518440478>';
          let cor = 'Secondary'
          if (isBomb === 'true') {
          emoji = '💣'
          cor = 'Danger'
          }
          const button = new ButtonBuilder()
            .setCustomId(`${id}`)
            .setLabel(' ')
            .setEmoji(emoji)
            .setStyle(cor)
            .setDisabled(true)
          row.addComponents(button);
    id++
        }
    otherRow.push(row)
    }
    const row2 = new ActionRowBuilder();
    const button = new ButtonBuilder()
    .setCustomId(`finalizar-9-9-9-9`)
    .setLabel('Finalizar jogo')
    .setEmoji('<:gold_donator:1053256617518440478>')
    .setDisabled(true)
    .setStyle('Success');
    idsArray.push(`finalizar-9-9-9-9`)

    row2.addComponents(button);
    otherRow.push(row2)
    interaction.editReply({ components: otherRow })
        
    } else {
        multiply += 0.25;
         
        const idsArray2 = []

        let id = 0;
        for (i = 0; i < 4; i++) {
        const row = new ActionRowBuilder();

        for (j = 0; j < 4; j++) {
     
          const isBombs = `${idsArray[id]}`
          const starCalc = isBombs.split('-');
          

          let emoji = '<:caixa:1051978207110377573>';
          let cor = 'Primary'
          let disabled = false
          if (starCalc[4] === 'true') {
            emoji = '<:gold_donator:1053256617518440478>'
            cor = 'Secondary'
            disabled = true
          }
          if (starCalc[1] === ids[1] && starCalc[2] === ids[2]) {
          emoji = '<:gold_donator:1053256617518440478>'
          cor = 'Secondary'
          disabled = true
          idsArray[id] = `${starCalc[0]}-${starCalc[1]}-${starCalc[2]}-${starCalc[3]}-${disabled}`
          }
          const button = new ButtonBuilder()
            .setCustomId(`${starCalc[0]}-${starCalc[1]}-${starCalc[2]}-${starCalc[3]}-${disabled}`)
            .setLabel(' ')
            .setEmoji(emoji)
            .setStyle(cor)
            .setDisabled(disabled)
          row.addComponents(button);

    id++
        }
    otherRow2.push(row)
    }
    const row2 = new ActionRowBuilder();
    const button = new ButtonBuilder()
    .setCustomId(`finalizar-9-9-9-9`)
    .setLabel('Finalizar jogo')
    .setEmoji('<:gold_donator:1053256617518440478>')
    .setStyle('Success');
    idsArray.push(`finalizar-9-9-9-9`)

    row2.addComponents(button);
    otherRow2.push(row2)
    const embed = new EmbedBuilder()
    .setTitle(client.user.username + ' | Mines Game💣')
    .setColor("#be00e8")
    .setDescription(`
    Multiplicador: ${multiply.toFixed(2)}
    Ganhos: **${Math.floor(valor * multiply)}** Lunar coins
    `);
    interaction.editReply({embeds: [embed], components: otherRow2 })
    }
        })
        });
     

    }
}