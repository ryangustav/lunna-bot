const { SlashCommandBuilder, AttachmentBuilder } = require('discord.js');
const { createCanvas, loadImage, registerFont } = require('canvas');
const LunarModel = require('../../database/schema/coins_database.js');
const path = require('path');
const i18next = require('i18next');

try {
    registerFont(path.join(__dirname, '../../assets/fonts/Montserrat-Bold.ttf'), { family: 'Montserrat' });
    registerFont(path.join(__dirname, '../../assets/fonts/NotoColorEmoji-Regular.ttf'), { family: 'Noto Color Emoji' });
    registerFont(path.join(__dirname, '../../assets/fonts/MoreSugar-Regular.otf'), { family: 'More Sugar Regular' });
} catch (error) {
    console.error('Error loading font:', error);
}

const userCache = new Map();

function sanitizeUsername(username) {
    const containsSpecialChars = /[^\x00-\x7F]|[\uD800-\uDBFF][\uDC00-\uDFFF]/.test(username);
    
    if (containsSpecialChars) {
     return username.replace(/[^\x00-\x7F]|[\uD800-\uDBFF][\uDC00-\uDFFF]/g, "?");
    }
    
    return username;
}

function drawRoundedRect(ctx, x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
    ctx.fill();
}

async function getUserBanner(userId) {
    try {
        const response = await fetch(`https://discord.com/api/v10/users/${userId}`, {
            headers: {
                Authorization: `Bot ${process.env.TOKEN}`
            }
        });

        if (!response.ok) return null;

        const data = await response.json();
        if (data.banner) {
            return `https://cdn.discordapp.com/banners/${userId}/${data.banner}?size=2048&format=png`;
        }

        if (data.accent_color) {
            const canvas = createCanvas(1000, 300);
            const ctx = canvas.getContext('2d');
            const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
            const hexColor = '#' + data.accent_color.toString(16).padStart(6, '0');
            gradient.addColorStop(0, hexColor);
            gradient.addColorStop(1, '#000000');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            return canvas.toBuffer();
        }

        return null;
    } catch (error) {
        console.error('Error fetching banner:', error);
        return null;
    }
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('top')
        .setDescription('「📊」Mostra o top 10 usuários com mais coins')
        .setDescriptionLocalizations({
            'en-US': '「📊」Show top 10 users with most coins',
            'en-GB': '「📊」Show top 10 users with most coins'
        }),

    async execute(interaction, client) {
        await interaction.deferReply();

        try {
            const topUsers = await LunarModel.find({ 
                user_id: { $ne: null },
                coins: { $exists: true, $ne: null }
            })
                .sort({ coins: -1 })
                .limit(10)
                .lean()
                .catch(error => {
                    console.error('Database query error:', error);
                    throw new Error('Failed to fetch leaderboard data');
                });

            if (!topUsers?.length) {
                return await interaction.editReply({
                    content: i18next.t('leaderboard.no_data', { 
                        lng: interaction.locale || 'pt-BR',
                        defaultValue: 'No leaderboard data available.'
                    })
                });
            }

            const backgroundImage = await loadImage(path.join(__dirname, '../../assets/images/Leaderboard.png'));
            
            const canvas = createCanvas(backgroundImage.width, backgroundImage.height);
            const ctx = canvas.getContext('2d');
            
            ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);

            for (let i = 0; i < topUsers.length; i++) {
                const userId = topUsers[i].user_id;
                try {
                    let userData = userCache.get(userId);
                    
                    if (!userData || Date.now() - userData.timestamp > 3600000) {
                        const user = await client.users.fetch(`${userId}`);
                        const avatarURL = user.displayAvatarURL({ extension: 'png', size: 128 });
                        
                        userData = {
                            username: user.displayName,
                            avatar: await loadImage(avatarURL),
                            timestamp: Date.now()
                        };
                        userCache.set(userId, userData);
                    }

                 
                    let avatarX, avatarY, textX, textY;
                    let avatarSize = 115; 
                    
                    if (i === 0) { 
                        avatarX = 773;
                        avatarY = 235;
                        textX = 775 + avatarSize/2;
                        textY = 325 + avatarSize + 30;
                    } else if (i === 1) {
                        avatarX = 1068;
                        avatarY = 443;
                        textX = 1070 + avatarSize/2;
                        textY = 508 + avatarSize + 30;
                    } else {
                 
                        const isLeftSide = i < 6; 
                        const positionInSide = isLeftSide ? i - 2 : i - 6;
                        
                        if (isLeftSide) {
                            if (i === 2) { 
                                avatarY = 256;  
                                avatarX = 107;
                            } else if (i === 4) {
                                avatarY = 260 + (positionInSide * 200);
                                avatarX = 105;
                            } else if (i === 5) {
                                avatarY = 260 + (positionInSide * 203);
                                avatarX = 105;
                            } else {
                                avatarY = 260 + (positionInSide * 195);
                                avatarX = 105;
                            }
                            
                            avatarSize = 110;
                            textX = avatarX + avatarSize + 25; 
                        } else {
                            
                            if (i === 8) {
                                avatarY = 260 + (positionInSide * 208);
                            } else if (i === 9) {
                                avatarY = 260 + (positionInSide * 209);
                            } else {
                                avatarY = 260 + (positionInSide * 200);
                            }
                            avatarX = 1355;
                            avatarSize = 110;
                            textX = avatarX + avatarSize + 25; // Ajustado para melhor alinhamento
                        }
                        
                        textY = avatarY + avatarSize/2; // Centralizado verticalmente com o avatar
                    }

                    // Desenhar o avatar circular
                    ctx.save();
                    ctx.beginPath();
                    ctx.arc(avatarX + avatarSize/2, avatarY + avatarSize/2, avatarSize/2, 0, Math.PI * 2);
                    ctx.closePath();
                    ctx.clip();
                    ctx.drawImage(userData.avatar, avatarX, avatarY, avatarSize, avatarSize);
                    ctx.restore();
                    
                    // Definir texto e alinhamento
                    if (i < 2) {
                        // Para 1º e 2º lugares, texto centralizado abaixo do avatar
                        ctx.textAlign = 'center';
                        
                        // Configuração da sombra
                        ctx.shadowColor = 'rgba(235, 0, 255, 0.68)'; // Magenta com transparência
                        ctx.shadowBlur = 0; // Sem desfoque
                        ctx.shadowOffsetX = 1.90; // Lado direito
                        ctx.shadowOffsetY = 1.90; // Para baixo

                        // Desenhar o texto
                        ctx.fillStyle = '#FFFFFF'; // Cor do texto
                        ctx.font = 'bold 35px More Sugar Regular';
                        const rawUsername = userData.username || 'Unknown User';
                        const sanitizedUsername = sanitizeUsername(rawUsername);
                        const truncatedUsername = sanitizedUsername.length > 12 ? sanitizedUsername.slice(0, 10) + '...' : sanitizedUsername;
                        ctx.fillText(truncatedUsername, textX, textY);

                        // Resetar sombra para evitar impacto em outros elementos
                        ctx.shadowColor = 'transparent';
                        ctx.shadowBlur = 0;
                        ctx.shadowOffsetX = 0;
                        ctx.shadowOffsetY = 0;
                        
                        // Quantidade de coins - Nova cor #B57EDC (roxo claro)
                        // Configuração da sombra
                        ctx.shadowColor = 'rgba(0, 0, 0, 0.75)'; // Magenta com transparência
                        ctx.shadowBlur = 0; // Sem desfoque
                        ctx.shadowOffsetX = 2.20; // Lado direito
                        ctx.shadowOffsetY = 2.20; // Para baixo

                        ctx.fillStyle = '#B57EDC';
                        ctx.font = 'bold 35px Montserrat';
                        ctx.fillText(`${topUsers[i].coins.toLocaleString()}`, textX, textY + 50);

                        ctx.shadowColor = 'transparent';
                        ctx.shadowBlur = 0;
                        ctx.shadowOffsetX = 0;
                        ctx.shadowOffsetY = 0;

                    } else {
                        // Para 3º-10º lugares
                        const isLeftSide = i < 6; // 3, 4, 5, 6 ficam à esquerda
                        
                        if (isLeftSide) {
                            // Texto à direita para posições da esquerda
                            ctx.textAlign = 'left';
                        } else {
                            // Texto à esquerda para posições da direita
                            ctx.textAlign = 'left';
                        }
                         
                        // Nome do usuário
                        ctx.shadowColor = 'rgba(235, 0, 255, 0.68)'; // Magenta com transparência
                        ctx.shadowBlur = 0; // Sem desfoque
                        ctx.shadowOffsetX = 0.90; // Lado direito
                        ctx.shadowOffsetY = 0.90; // Para baixo
                        
                        // Desenhar o texto
                        ctx.fillStyle = '#FFFFFF';
                        ctx.font = 'bold 35px More Sugar Regular';
                        const rawUsername = userData.username || 'Unknown User';
                        const sanitizedUsername = sanitizeUsername(rawUsername);
                        const truncatedUsername = sanitizedUsername.length > 16 ? sanitizedUsername.slice(0, 16) + '...' : sanitizedUsername;
                        ctx.fillText(truncatedUsername, textX, textY);
                        
          
                        ctx.shadowColor = 'transparent';
                        ctx.shadowBlur = 0;
                        ctx.shadowOffsetX = 0;
                        ctx.shadowOffsetY = 0;
                        
                        ctx.shadowColor = 'rgba(0, 0, 0, 0.75)'; 
                        ctx.shadowBlur = 0; 
                        ctx.shadowOffsetX = 2.20;
                        ctx.shadowOffsetY = 2.20;


                        ctx.fillStyle = '#B57EDC';
                        ctx.font = 'bold 35px Montserrat';
                        ctx.fillText(`${topUsers[i].coins.toLocaleString()}`, textX, textY + 40);

                        ctx.shadowColor = 'transparent';
                        ctx.shadowBlur = 0;
                        ctx.shadowOffsetX = 0;
                        ctx.shadowOffsetY = 0;
                    }
                    
                } catch (userError) {
                    console.error(`Error processing user ${userId}:`, userError);
                }
            }

            const attachment = new AttachmentBuilder(canvas.toBuffer(), { 
                name: 'leaderboard.png',
                description: 'Rank Global de Lunnar Coins'
            });

            await interaction.editReply({ files: [attachment] });

        } catch (error) {
            console.error('Error in leaderboard command:', error);
            await interaction.editReply({
                content: i18next.t('leaderboard.error', {
                    lng: interaction.locale || 'pt-BR',
                    defaultValue: 'An error occurred while generating the leaderboard.'
                }),
                ephemeral: true
            });
        }
    }
};