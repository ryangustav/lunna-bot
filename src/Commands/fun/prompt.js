const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, Events, EmbedBuilder, Embed } = require("discord.js");
const LunarModel = require("../../database/schema/coins_database.js")
const generative = require(`../../util/IA-generative.js`)
const bania = require("../../database/schema/banned_user.js")

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
    const verify_ban = await bania.findOne({ user_id: interaction.user.id })
    if (!verify) await LunarModel.create({ user_id: interaction.user.id, coins: 0, isVip: false, prompts_used: 0 })
    if (!verify_ban) await bania.create({ user_id: interaction.user.id, isBanned: false, prompts_sexuais: 0 })
    const user = await LunarModel.findOne({ user_id: interaction.user.id })
    const ban = await bania.findOne({ user_id: interaction.user.id })
    if (ban.isBanned === true) return interaction.editReply({ content: `<:moderator:1238705467883126865> | Você está banido! Não podera usar meus comandos. Para contextar o banimento entre em [meu servidor](https://em-breve.xyz/)`})
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
let resposta = await generative(prompt, interaction.user.id);
clearInterval(sendTypingInterval)

if (resposta.toString().includes('Candidate was blocked due to SAFETY')) {

    const row = new ActionRowBuilder()
    .addComponents(
    new ButtonBuilder()
    .setLabel(`Banir da IA`)
    .setStyle(`Primary`)
    .setEmoji('<a:ban_ban:1239710558249422879>')
    .setCustomId(`bania-${interaction.user.id}`)
    )
    ban.prompts_sexuais += 1;
    ban.save();
    client.channels.cache.get('1053336886355169320').send({ content: `⚠️ | O usuario ${interaction.user.username} (\`${interaction.user.id}\`) Foi pego tentando usar prompts sexuais/gore!`, components: 'row'})
    resposta = resposta.toString().replace('[GoogleGenerativeAI Error]:', '').replace('Candidate was blocked due to SAFETY', 'O usuario foi bloqueado por motivos de SEGURANÇA')
    }


user.prompts_used += 1;
user.save()
await interaction.editReply({ content: `${resposta} ` })
clearTimeout(error)
    },
};