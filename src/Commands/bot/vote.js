const Discord = require("discord.js");
const LunarModel = require("../../database/schema/coins_database.js");
const VoteModel = require("../../database/schema/vote.js"); 
const i18next = require('i18next');
require('dotenv').config();

module.exports = {
    data: new Discord.SlashCommandBuilder()
        .setName("vote")
        .setDescription("「📡」Vote em mim")
        .setDescriptionLocalizations({ 
            'en-US': '「📡」Vote for me',
            'en-GB': '「📡」Vote for me',
        })
        .setDMPermission(false),

    async execute(interaction, client) {
        try {
       
            let lunnaUser = await LunarModel.findOne({ user_id: interaction.user.id });
            if (!lunnaUser) {
                lunnaUser = await LunarModel.create({ 
                    user_id: interaction.user.id, 
                    coins: 0, 
                    isVip: false, 
                    prompts_used: 0,
                    hasVoted: false,
                    voteTimestamp: 0,
                    language: 'pt-BR' 
                });
            }
            
            const userLanguage = lunnaUser.language || 'pt-BR'; 
            const currentTime = Math.floor(Date.now() / 1000);
            
        
            if (lunnaUser.hasVoted && lunnaUser.voteTimestamp < currentTime) {
                await LunarModel.updateOne(
                    { user_id: interaction.user.id },
                    { $set: { hasVoted: false, voteTimestamp: 0 } }
                );
                lunnaUser.hasVoted = false;
            }
            
        
            let voteData = await VoteModel.findOne({ userId: interaction.user.id });
            
         
            if (!voteData) {
                voteData = await VoteModel.create({
                    userId: interaction.user.id,
                    hasCollected: false,
                    hasVoted: false,
                    type: null,
                    query: null,
                    votedAt: new Date()
                });
            }
            
       
            if (!voteData.hasVoted) {
                return interaction.reply({ 
                    content: i18next.t('vote.message', { 
                        lng: userLanguage,
                     }),  
                    
                    ephemeral: true 
                });
            } 
            
    
            
            const random_vote = Math.floor(Math.random() * (10000 - 1000 + 1)) + 1000;
            const nextVoteTime = currentTime + (12 * 60 * 60); 
       
      
            await LunarModel.updateOne(
                { user_id: interaction.user.id }, 
                { 
                    $inc: { coins: random_vote },
                    $set: { 
                        hasCollected: true,
                        hasVoted: false, 
                        voteTimestamp: nextVoteTime, 
                        prompts_used: 0, 
                        image_prompts_used: 0 
                    }
                }
            );
            
       
            await VoteModel.updateOne(
                { userId: interaction.user.id },
                { $set: { hasCollected: true, hasVoted: false } }
            );
            
     
            return interaction.reply({ 
                content: i18next.t('vote.voted', { 
                    user: `<@${interaction.user.id}>`,
                    coins: random_vote,
                    lng: userLanguage 
                }), 
                ephemeral: false 
            });
        } catch (error) {
            console.error('Erro no comando vote:', error);
            
            let userLanguage = 'pt-BR';
            try {
                const user = await LunarModel.findOne({ user_id: interaction.user.id });
                if (user && user.language) {
                    userLanguage = user.language;
                }
            } catch (dbError) {
                console.error('Erro ao buscar idioma do usuário:', dbError);
            }
            
            return interaction.reply({ 
                content: i18next.t('errors.generic', { lng: userLanguage }),
                ephemeral: true 
            });
        }
    },
};