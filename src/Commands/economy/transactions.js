const { SlashCommandBuilder } = require("discord.js");
const LunarModel = require("../../database/schema/coins_database.js");
const transactionsModel = require('../../database/schema/transactions.js');
const Discord = require(`discord.js`);

module.exports = {
  data: new SlashCommandBuilder()
    .setName("transactions")
    .setDescription("「💰」Veja suas transações")
    .setDMPermission(false),

  async execute(interaction, client) {
    const transactions = await transactionsModel.findOne({ user_id: interaction.user.id });
    if (!transactions || !transactions.transactions.length) {
      return interaction.reply({ content: `<:naoJEFF:1109179756831854592> | Você ainda não possui transações!` });
    }

    const transactionsPerPage = 10; 
    const totalPages = Math.ceil(transactions.transactions.length / transactionsPerPage);
    let currentPage = 1;

    const generateTransactionList = (page) => {
      const startIndex = (page - 1) * transactionsPerPage;
      const endIndex = Math.min(page * transactionsPerPage, transactions.transactions.length);
      const pageTransactions = transactions.transactions.slice(startIndex, endIndex);

      let tr = '';
      pageTransactions.forEach(object => {
        tr += `[ <t:${Math.floor(object.timestamp)}:d> <t:${Math.floor(object.timestamp)}:t> | <t:${Math.floor(object.timestamp)}:R> ] 💸 ${object.mensagem}\n`;
      });

      return tr;
    };

    const embed = new Discord.EmbedBuilder()
      .setTitle(`${interaction.user.username} | Transações (Página ${currentPage} de ${totalPages})`)
      .setColor("#be00e8")
      .setDescription(generateTransactionList(currentPage))
      .setFooter({ text: `Quantidade de transações: ${transactions.transactions.length}` });

    const buttonRow = new Discord.ActionRowBuilder();
    buttonRow.addComponents(
        new Discord.ButtonBuilder()
          .setCustomId('prev_page')
          .setLabel(' ')
          .setEmoji('<:world_setae:1000602510706343936>')
          .setStyle(Discord.ButtonStyle.Primary)
      );
      buttonRow.addComponents(
        new Discord.ButtonBuilder()
          .setCustomId('next_page')
          .setLabel(' ')
          .setEmoji('<:world_setad:1000602463272976425>')
          .setStyle(Discord.ButtonStyle.Primary)
      );

    const message = await interaction.reply({ embeds: [embed], components: buttonRow.components.length ? [buttonRow] : [] }); 
    const buttonCollector = message.createMessageComponentCollector({ time: 60000 }); // Adjust timeout as needed

    buttonCollector.on('collect', async (buttonInteraction) => {
      if (!buttonInteraction.isButton()) return;

      await buttonInteraction.deferUpdate();

      if (buttonInteraction.customId === 'prev_page') {
        if (currentPage === 1) return
        currentPage--;
      } else if (buttonInteraction.customId === 'next_page') {
        currentPage++;
      }

      embed.setTitle(`${interaction.user.username} | Transações (Página ${currentPage} de ${totalPages})`);
      embed.setDescription(generateTransactionList(currentPage));

      await buttonInteraction.editReply({ embeds: [embed], components: buttonRow.components.length ? [buttonRow] : [] });
    });

   
  },
};
