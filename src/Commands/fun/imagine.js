const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, Events, EmbedBuilder, Embed, MessageAttachment } = require("discord.js");
const LunarModel = require("../../database/schema/coins_database.js")
const { createProdia } = require('prodia')
const bania = require("../../database/schema/banned_user.js")
const translate = require('translate-google')

const prodia = createProdia({
	apiKey: "69eddfe6-114b-41c3-8781-393bef804a89",
});
module.exports = {
    data: new SlashCommandBuilder()
        .setName("imagine")
        .setDescription("「🎉」Faça-me imaginar uma imagem")
        .setDMPermission(false)
        .setNSFW(true)
        .addStringOption(option => 
            option
            .setName('prompt')
            .setDescription('Oque você quer que eu faça?')
            .setRequired(true)
        )
        .addStringOption(option => 
            option
            .setName('style')
            .setDescription('Qual estilo de arte que você quer')
            .setRequired(false)
            .addChoices(
                { name: '3d', value: '3d-model' },
                { name: 'film', value: 'analog-film' },
                { name: 'anime', value: 'anime' },
                { name: 'cinematic', value: 'cinematic' },
                { name: 'comic', value: 'comic-book' },
                { name: 'digital', value: 'digital-art' },
                { name: 'enhance', value: 'enhance' },
                { name: 'fantasy', value: 'fantasy-art' },
                { name: 'isometric', value: 'isometric' },
                { name: 'line', value: 'line-art' },
                { name: 'lowpoly', value: 'low-poly' },
                { name: 'neonpunk', value: 'neon-punk' },
                { name: 'origami', value: 'origami' },
                { name: 'photographic', value: 'photographic' },
                { name: 'pixel', value: 'pixel-art' },
                { name: 'texture', value: 'texture' },
                { name: 'clay', value: 'craft-clay' }
            )
        ),
    
    async execute(interaction, client) {
    //Inciando prompts
    await interaction.reply({ content: `<a:azu_carregando:1122709454291488850> | Estou pensando...` })
    const prompt = `${interaction.options.getString('prompt')}`;
    const preset = interaction.options.getString('style') ? interaction.options.getString('style') : 'photographic';
    const verify = await LunarModel.findOne({ user_id: interaction.user.id })
    const verify_ban = await bania.findOne({ user_id: interaction.user.id })
    if (!verify) await LunarModel.create({ user_id: interaction.user.id, coins: 0, isVip: false, prompts_used: 0 })
    if (!verify_ban) await bania.create({ user_id: interaction.user.id, isBanned: false, prompts_sexuais: 0 })
    const user = await LunarModel.findOne({ user_id: interaction.user.id })
    const ban = await bania.findOne({ user_id: interaction.user.id })
    if (ban.isBanned === true) return interaction.editReply({ content: `<:moderator:1238705467883126865> | Você está banido! Não podera usar meus comandos. Para contextar o banimento entre em [meu servidor](https://discord.gg/23AhePRDAf)`})
    if (user.image_prompts_used === 3 && user.isVip === false) return interaction.editReply({ content: `<:naoJEFF:1109179756831854592> | Você atingiu o limite de prompts gratis diarios`})
    if (user.image_prompts_used === 10 && user.isVip === true) return interaction.editReply({ content: `<:naoJEFF:1109179756831854592> | Você atingiu o limite de prompts vip diario`})
    if (interaction.channel.nsfw === false) return interaction.editReply({ content: `<:naoJEFF:1109179756831854592> | Esse canal não é nsfw!`})
    const translated_prompt = await translate(prompt, {to: 'en'});

    const imagine = await prodia.generate({
		prompt: `${translated_prompt}`,
        style_preset: preset,
        model: 'amIReal_V41.safetensors [0a8a2e61]',
	});
      
const prodiaa = await prodia.wait(imagine);
user.image_prompts_used += 1;
user.save()
interaction.editReply({ files: [prodiaa.imageUrl], content: `${interaction.user} Sua imagem ficou pronta!\n<:file:1052384025089687614> Prompt: ${prompt.replace(", no make nsfw images, no make pornografic images, no show tits", '')}\n<:config:1052355072782254152> Preset: ${preset}`})
    }
}