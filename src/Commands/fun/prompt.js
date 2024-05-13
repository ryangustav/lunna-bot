const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, Events, EmbedBuilder, Embed } = require("discord.js");
const { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } = require("@google/generative-ai");
const LunarModel = require("../../database/schema/coins_database.js")
const genAI = new GoogleGenerativeAI(process.env.gemini_token);
const fs = require('fs').promises;

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
    const verify = await LunarModel.findOne({ user_id: interaction.user.id })
    if (!verify) await LunarModel.create({ user_id: interaction.user.id, coins: 0, isVip: false, prompts_used: 0 })
    const user = await LunarModel.findOne({ user_id: interaction.user.id })
    if (user.prompts_used === 60 && user.isVip === false) return interaction.reply({ content: `<:naoJEFF:1109179756831854592> | Você atingiu o limite de prompts gratis diarios`})
    if (user.prompts_used === 160 && user.isVip === true) return interaction.reply({ content: `<:naoJEFF:1109179756831854592> | Você atingiu o limite de prompts vip diario`})

const sendTypingInterval = setInterval(() => {
    interaction.channel.sendTyping();
 }, 5000);
  const prompt = interaction.options.getString('prompt')
  const personalityFilePath = __dirname + '../../../../personality.txt';
  const ask = __dirname + '../../../../asks-respostas.txt';
  const personalityContent = await fs.readFile(personalityFilePath, 'utf-8');
  const personalityLines = personalityContent.split('\n');
  interaction.reply({ content: `<a:azu_carregando:1122709454291488850> | Estou pensando na resposta...`})

  const error = setTimeout(() => {
    interaction.editReply({ content: `⚠️ Ocorreu um erro desconhecido ao gerar sua resposta - O seu limite de prompts para hoje pode ter sido atingido.`, ephemeral: true})
    clearInterval(sendTypingInterval)
}, 10000)
try {
  const safetySettings = [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
    },
    {
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
        category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
    },
    {
        category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
  ];

  const generationConfig = {
    maxOutputTokens: 750,
};
const model = genAI.getGenerativeModel({ model: "gemini-pro", safetySettings, generationConfig});

const chat = model.startChat({
    history: [
      {
        role: "user",
        parts: [
          {
            text: `${personalityLines}\n Cumprimente o usuário com uma saudação e depois seu nome, que é: <@${interaction.user.id}>.`,
          },
        ],
      },
      {
        role: "model",
        parts: [
          {
            text: `Vou cumprimentar o usuário com seu nome: <@${interaction.user.id}>. Também limitarei todas as minhas respostas a 2.000 caracteres ou menos, independentemente do que você disser. Sinta-se à vontade para me perguntar qualquer coisa! `,
          },
        ],
      },
    ],
    generationConfig: {
      maxOutputTokens: 750,
    },
  });

const result = await chat.sendMessage(prompt);
const response = await result.response;

const responseLength = response.text().length;
if (responseLength > 2000) {
  response.text = response.text().substring(0, 1928 - "... \n\n".length) + "... \n\n*A resposta foi interrompida devido ao limite de caracteres do Discords de 2.000*";
}
const resposta = await response.text()

clearInterval(sendTypingInterval)
clearTimeout(error)
user.prompts_used += 1;
user.save()
fs.appendFile(ask, `${prompt} - ${resposta}\n`)
interaction.editReply({ content: resposta })
.catch(err => {
interaction.reply({ content: `⚠️ Ocorreu um erro desconhecido ao gerar sua resposta - O seu limite de prompts para hoje pode ter sido atingido.`, ephemeral: true})
})
} catch(err) {
console.log(err)
switch (err.message) {
    case "[GoogleGenerativeAI Error]: Text not available. Response was blocked due to SAFETY":
        const safety_error = new EmbedBuilder()
        .setTitle("⚠️ Ocorreu um erro")
        .setDescription("> *A resposta foi bloqueada devido as minhas politicas de segurança.*")
        .setColor("Red")

        return await interaction.reply({ embeds: [safety_error], ephemeral: true});

    case "[GoogleGenerativeAI Error]: Error fetching from https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent: [400 Bad Request] User location is not supported for the API use.":
        const location_error = new EmbedBuilder()
        .setTitle("⚠️ Ocorreu um erro")
        .setDescription("> *Desconhecido*")
        .setColor("Red")

        return await interaction.reply({ embeds: [location_error], ephemeral: true});

    case "Cannot send an empty message":
    case "response.text is not a function":
        const error = new EmbedBuilder()
            .setTitle("⚠️ Ocorreu um erro")
            .setDescription("Um erro ocorreu durante o processamento do seu pedido. Tente novamente mais tarde ou em alguns minutos. \n*Se o problema persistir, entre em contato com os desenvolvedores.* \n\n> - A resposta gerada pode ser muito longa. *(Corrija isso especificando que a resposta gerada seja menor, por exemplo, 10 linhas)*\n> - O seu limite de prompts para hoje pode ter sido atingido.")
            .setColor("Red")

        return await interaction.reply({ embeds: [error], ephemeral: true});
    
    default:
        const error_unknown = new EmbedBuilder()
            .setTitle("⚠️ Ocorreu um erro")
            .setDescription("Ocorreu um erro desconhecido ao processar sua solicitação. Tente novamente mais tarde ou em alguns minutos. \n*Se o problema persistir, entre em contato com os desenvolvedores.*\n> - O seu limite de prompts para hoje pode ter sido atingido.")
            .setColor("Red")

        await interaction.reply({embeds: [error_unknown], ephemeral: true
        });
    }
}
    },
};