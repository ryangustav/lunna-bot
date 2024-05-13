const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, Events, EmbedBuilder, Embed } = require("discord.js");
const LunarModel = require("../../database/schema/coins_database.js")
const generative = require(`../../util/IA-generative.js`)

module.exports = {
    data: new SlashCommandBuilder()
        .setName("lunna")
        .setDescription("「🎉」Pergunte algo a minha IA")
        .setDMPermission(false)
        .addStringOption(option => 
            option
            .setName('prompt')
            .setDescription('Oque você quer perguntar?')
            .setRequired(true)
        ),
    async execute(interaction, client) {
    //Inciando prompts
    await interaction.reply({ content: `<a:azu_carregando:1122709454291488850> | Estou pensando...` })
    const prompt = interaction.options.getString('prompt')
    const verify = await LunarModel.findOne({ user_id: interaction.user.id })
    if (!verify) await LunarModel.create({ user_id: interaction.user.id, coins: 0, isVip: false, prompts_used: 0 })
    const user = await LunarModel.findOne({ user_id: interaction.user.id })
    if (user.prompts_used === 60 && user.isVip === false) return interaction.editReply({ content: `<:naoJEFF:1109179756831854592> | Você atingiu o limite de prompts gratis diarios`})
    if (user.prompts_used === 160 && user.isVip === true) return interaction.editReply({ content: `<:naoJEFF:1109179756831854592> | Você atingiu o limite de prompts vip diario`})
      



//Intervalos e timeouts
const sendTypingInterval = setInterval(() => {
    interaction.channel.sendTyping();
 }, 5000);
 const error = setTimeout(() => {
  interaction.editReply({ content: `⚠️ Ocorreu um erro desconhecido ao gerar sua resposta - O seu limite de prompts para hoje pode ter sido atingido.`, ephemeral: true})
  clearInterval(sendTypingInterval)
}, 10000)


//Resposta e clear interval
const resposta = await generative(prompt, interaction.user.id);
clearInterval(sendTypingInterval)

user.prompts_used += 1;
user.save()
await interaction.editReply({ content: `${resposta} ` })
clearTimeout(error)
    },
};