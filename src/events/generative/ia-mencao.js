const LunarModel = require("../../database/schema/coins_database.js")
const bania = require("../../database/schema/banned_user.js")
const generative = require("../../util/IA-generative.js")
const discord = require('discord.js')

module.exports = {
    name: "messageCreate",
    async execute(message, client) {
    const me = message.mentions.users.first()
    const args = message.content
    .trim()
    .split(/ +/g);
    const prompt = args.slice(1).join(' ')
    const verify = await LunarModel.findOne({ user_id: message.author.id })
    const verify_ban = await bania.findOne({ user_id: message.author.id })

    //Verificações
    if (message.author.bot === true) return;
    if (me.id !== client.user.id) return;
    if (!message.content.startsWith(me)) return;
    if (!prompt) return;
    const msg = await message.reply({ content: `<a:azu_carregando:1122709454291488850> | Estou pensando...`})
    if (!verify) await LunarModel.create({ user_id: message.author.id, coins: 0, isVip: false, prompts_used: 0 })
    if (!verify_ban) await bania.create({ user_id: message.author.id, isBanned: false, prompts_sexuais: 0 })
    const user = await LunarModel.findOne({ user_id: message.author.id })
    const ban = await bania.findOne({ user_id: message.author.id })
    if (ban.isBanned === true) return msg.edit({ content: `<:moderator:1238705467883126865> | Você está banido! Não podera usar meus comandos. Para contextar o banimento entre em [meu servidor](https://em-breve.xyz/)`})
    if (user.prompts_used === 60 && user.isVip === false) return msg.edit({ content: `<:naoJEFF:1109179756831854592> | Você atingiu o limite de prompts gratis diarios`})
    if (user.prompts_used === 160 && user.isVip === true) return msg.edit({ content: `<:naoJEFF:1109179756831854592> | Você atingiu o limite de prompts vip diario`})
   
    
    

    const sendTypingInterval = setInterval(() => {
        message.channel.sendTyping();
     }, 5000);
     const error = setTimeout(() => {
        msg.edit({ content: `⚠️ Ocorreu um erro desconhecido ao gerar sua resposta - O seu limite de prompts para hoje pode ter sido atingido.`, ephemeral: true})
      clearInterval(sendTypingInterval)
    }, 10000)
let resposta = await generative(prompt, message.author.id);

//Safety IA
if (resposta.toString().includes('Candidate was blocked due to SAFETY')) {

const row = new discord.ActionRowBuilder()
.addComponents(
new discord.ButtonBuilder()
.setLabel(`Banir da IA`)
.setStyle(`Primary`)
.setEmoji('<a:ban_ban:1239710558249422879>')
.setCustomId(`bania-${message.author.id}`)
)
ban.prompts_sexuais += 1;
ban.save();
client.channels.cache.get('1053336886355169320').send({ content: `⚠️ | O usuario ${message.author.username} (\`${message.author.id}\`) Foi pego tentando usar prompts sexuais/gore!`, components: [row]})
resposta = resposta.toString().replace('[GoogleGenerativeAI Error]:', '').replace('Candidate was blocked due to SAFETY', 'O usuario foi bloqueado por motivos de SEGURANÇA')
}

//Error
if (resposta.toString().includes('[GoogleGenerativeAI Error]')) { 
resposta = resposta.toString().replace('[GoogleGenerativeAI Error]:', '')
}
clearInterval(sendTypingInterval)

user.prompts_used += 1;
user.save()
await msg.edit({ content: `${resposta} `})
clearTimeout(error)
    }
}