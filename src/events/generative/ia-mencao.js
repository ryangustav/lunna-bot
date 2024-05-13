const LunarModel = require("../../database/schema/coins_database.js")
const generative = require("../../util/IA-generative.js")


module.exports = {
    name: "messageCreate",
    async execute(message, client) {
    const me = message.mentions.users.first()
    const args = message.content
    .trim()
    .split(/ +/g);
    const prompt = args.slice(1).join(' ')
    const verify = await LunarModel.findOne({ user_id: message.author.id })
    
    //Verificações
    if (message.author.bot === true) return;
    if (me.id !== client.user.id) return;
    if (!message.content.startsWith(me)) return;
    if (!prompt) return;
   const msg = await message.reply({ content: `<a:azu_carregando:1122709454291488850> | Estou pensando...`})
    if (!verify) await LunarModel.create({ user_id: message.author.id, coins: 0, isVip: false, prompts_used: 0 })
    const user = await LunarModel.findOne({ user_id: message.author.id })
    if (user.prompts_used === 60 && user.isVip === false) return msg.edit({ content: `<:naoJEFF:1109179756831854592> | Você atingiu o limite de prompts gratis diarios`})
    if (user.prompts_used === 160 && user.isVip === true) return msg.edit({ content: `<:naoJEFF:1109179756831854592> | Você atingiu o limite de prompts vip diario`})
   
    
    

    const sendTypingInterval = setInterval(() => {
        message.channel.sendTyping();
     }, 5000);
     const error = setTimeout(() => {
        msg.edit({ content: `⚠️ Ocorreu um erro desconhecido ao gerar sua resposta - O seu limite de prompts para hoje pode ter sido atingido.`, ephemeral: true})
      clearInterval(sendTypingInterval)
    }, 10000)


    const resposta = await generative(prompt, message.author.id);
clearInterval(sendTypingInterval)

user.prompts_used += 1;
user.save()
await msg.edit({ content: `${resposta} `})
clearTimeout(error)
    }
}