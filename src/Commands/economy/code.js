const { SlashCommandBuilder, EmbedBuilder, AttachmentBuilder } = require('discord.js');
const LunarModel = require('../../database/schema/coins_database.js');
const RedeemModel = require('../../database/schema/codes.js');
const i18next = require('i18next');
const axios = require('axios');

const VIP_PERIODS = {
    '7d': 7,
    '15d': 15,
    '1m': 30,
    '3m': 90,
    '6m': 180,
    '12m': 360
};

function generateCode(length = 12) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < length; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
}


function calculateVipTimestamp(period) {
    const now = Date.now();
    const days = VIP_PERIODS[period];
    if (!days) return null;
    return now + (days * 24 * 60 * 60 * 1000); 
}


async function generateUniqueCode() {
    let code;
    let isUnique = false;
    while (!isUnique) {
        code = generateCode();
        const existingCode = await RedeemModel.findOne({ code: code });
        if (!existingCode) isUnique = true;
    }
    return code;
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('code')
        .setDescription('「🎫」Sistema de códigos')
        .setDescriptionLocalizations({
            'en-US': '「🎫」Code system',
            'en-GB': '「🎫」Code system'
        })
        .addSubcommand(subcommand =>
            subcommand
                .setName('redeem')
                .setDescription('「🎫」Resgatar um código')
                .addStringOption(option =>
                    option.setName('codigo')
                        .setDescription('Código para resgatar')
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('create')
                .setDescription('「🎫」Criar um novo código')
                .addBooleanOption(option =>
                    option.setName('vip')
                        .setDescription('Código VIP?')
                        .setRequired(true)
                )
                .addStringOption(option =>
                    option.setName('periodo')
                        .setDescription('Período do VIP')
                        .addChoices(
                            { name: '7 dias', value: '7d' },
                            { name: '15 dias', value: '15d' },
                            { name: '1 mês', value: '1m' },
                            { name: '3 meses', value: '3m' },
                            { name: '6 meses', value: '6m' },
                            { name: '12 meses', value: '12m' }
                        )
                        .setRequired(false)
                )
                .addNumberOption(option =>
                    option.setName('valor')
                        .setDescription('Quantidade de coins (apenas para códigos não-VIP)')
                        .setRequired(false)
                )
                .addIntegerOption(option =>
                    option.setName('quantidade')
                        .setDescription('Número de códigos para gerar (máximo 50)')
                        .setMinValue(1)
                        .setMaxValue(50)
                        .setRequired(false)
                )
                .addBooleanOption(option =>
                    option.setName('drop')
                        .setDescription('Drop ou Escondido?')
                        .setRequired(false)
                )
        ),
    async execute(interaction, client) {
        const subcommand = interaction.options.getSubcommand();

        if (subcommand === 'create') {
        
            if (interaction.user.id !== "852880352313868298") {
                return interaction.reply({
                    content: '❌ Você não tem permissão para criar códigos!',
                    ephemeral: true
                });
            }

            const isVip = interaction.options.getBoolean('vip');
            const period = interaction.options.getString('periodo');
            const value = interaction.options.getNumber('valor');
            const quantity = interaction.options.getInteger('quantidade') || 1;
            const drop = !interaction.options.getBoolean('drop');

          
            if (isVip && !period) {
                return interaction.reply({
                    content: '❌ Para códigos VIP, é necessário especificar um período!',
                    ephemeral: true
                });
            }

            if (!isVip && !value) {
                return interaction.reply({
                    content: '❌ Para códigos de coins, é necessário especificar um valor!',
                    ephemeral: true
                });
            }

          
            if (quantity > 1) {
                await interaction.reply({
                    content: `⏳ Gerando ${quantity} códigos, por favor aguarde...`,
                    ephemeral: true
                });
            }

        
            const generatedCodes = [];
            const codeBatch = [];

         
            for (let i = 0; i < quantity; i++) {
                const code = await generateUniqueCode();
                
                generatedCodes.push(code);
                
                codeBatch.push({
                    code: code,
                    type: isVip ? 'vip' : 'coins',
                    value: isVip ? VIP_PERIODS[period] : value,
                    status: false,
                    vip: isVip ? period : null
                });
            }

           
            await RedeemModel.insertMany(codeBatch);

           
            let fullListContent = `# Códigos Gerados (${quantity})\n\n`;
            fullListContent += `Tipo: ${isVip ? `VIP ${period}` : `${value} coins`}\n`;
            fullListContent += `Data: ${new Date().toLocaleString('pt-BR')}\n\n`;
            fullListContent += `## Lista Completa\n\n`;
            
            generatedCodes.forEach((code, index) => {
                fullListContent += `${index + 1}. \`${code}\` - ${isVip ? `VIP ${period}` : `${value} coins`}\n`;
            });
            
          
            let response = `✅ ${quantity > 1 ? `${quantity} códigos criados` : 'Código criado'} com sucesso!\n\n`;
            
       
            let codeListMessage = '**Códigos:**\n';
            generatedCodes.forEach((code, index) => {
                codeListMessage += `${index + 1}. \`${code}\` - ${isVip ? `VIP ${period}` : `${value} coins`}\n`;
            });
            
           
            if ((response.length + codeListMessage.length) > 4000) {
                
                const buffer = Buffer.from(fullListContent, 'utf-8');
                const attachment = new AttachmentBuilder(buffer, {
                    name: `codigos_${Date.now()}.txt`
                });
                
               
                response += `Tipo: ${isVip ? `VIP ${period}` : `${value} coins`}\n`;
                response += `Quantidade: ${quantity}\n\n`;
                response += `*Lista completa anexada como arquivo.*`;
                
                if (quantity > 1) {
                    await interaction.editReply({
                        content: response,
                        files: [attachment],
                        ephemeral: drop
                    });
                } else {
                    await interaction.reply({
                        content: response,
                        files: [attachment],
                        ephemeral: drop
                    });
                }
            } else {
                response += codeListMessage;

                if (quantity > 1) {
                    await interaction.editReply({
                        content: response,
                        ephemeral: drop
                    });
                } else {
                    await interaction.reply({
                        content: response,
                        ephemeral: drop
                    });
                }
            }
            
            return;
        }

        if (subcommand === 'redeem') {
            const code = interaction.options.getString('codigo');
            
           
            const codeData = await RedeemModel.findOne({ code: code });
            if (!codeData) {
                return interaction.reply({
                    content: '❌ Código inválido!',
                    ephemeral: true
                });
            }

            
            if (codeData.status === true) {
                return interaction.reply({
                    content: '❌ Este código já foi utilizado!',
                    ephemeral: true
                });
            }

       
            let userProfile = await LunarModel.findOne({ user_id: interaction.user.id });
            if (!userProfile) {
                userProfile = new LunarModel({
                    user_id: interaction.user.id,
                    language: 'pt-BR'
                });
            }

           
            if (codeData.type === 'vip') {
                const vipTimestamp = calculateVipTimestamp(codeData.vip);
                
             
                if (userProfile.isVip && userProfile.voteTimestamp > Date.now()) {
                    userProfile.voteTimestamp += (VIP_PERIODS[codeData.vip] * 24 * 60 * 60 * 1000);
                } else {
                    userProfile.isVip = true;
                    userProfile.voteTimestamp = vipTimestamp;
                }
            } else {
                userProfile.coins += codeData.value;
            }

          
            codeData.status = true;
            await codeData.save();
            await userProfile.save();

          
            let expirationDate = '';
            if (codeData.type === 'vip') {
                const expiration = new Date(userProfile.voteTimestamp);
                expirationDate = expiration.toLocaleDateString('pt-BR');
            }
            const timestamp = Math.floor(Date.now() / 1000);

             const data = { content: `<:gold_donator:1053256617518440478> | O usuario ${interaction.user}/(\`${interaction.user.username}\` - \`${interaction.user.id}\`) resgatou um código de ${codeData.type === 'vip' ? 
                `VIP por ${VIP_PERIODS[codeData.vip]} dias\nExpira em: ${expirationDate}` : 
                `${codeData.value} Lunar Coins`} as <t:${timestamp}:T>/<t:${timestamp}:d>!`}; 
             const webhookUrl = "https://discordapp.com/api/webhooks/1353526576985280662/CpvnIeXDb2Tiqm9vzWXf8R3uNphOBqF8E0dh9lCfteKhpNOe_4-uVf8uTJ6jtHZh9KD9"
             const headers = { 'Content-Type': 'application/json' };
             
             axios.post(webhookUrl, data, { headers })

            return interaction.reply({
                content: `✅ Código resgatado com sucesso!\nVocê recebeu: ${codeData.type === 'vip' ? 
                    `VIP por ${VIP_PERIODS[codeData.vip]} dias\nExpira em: ${expirationDate}` : 
                    `${codeData.value} Lunar Coins`}`,
                ephemeral: true
            });
        }
    }
}