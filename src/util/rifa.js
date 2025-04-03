const RifaModel = require('../database/schema/rifas_schema.js');
const RifaUserModel = require('../database/schema/rifa_user_schema.js');
const LunarModel = require('../database/schema/coins_database.js');
const i18next = require('i18next');

const RIFA_CONFIG = {
    PRICE: 100,
    INTERVAL: 3600000, 
    CHANNEL_ID: "1326249589581283411"
};

class RifaDrawSystem {
    constructor(client) {
        this.client = client;
        this.running = false;
        this.timeout = null;
        this.isDrawing = false; // Flag para evitar múltiplos sorteios simultâneos
    }

    start() {
        if (this.running) return;
        this.running = true;
        this.schedule();
    }

    stop() {
        if (this.timeout) {
            clearTimeout(this.timeout);
            this.timeout = null;
        }
        this.running = false;
    }

    schedule() {
        const now = new Date();
        const nextDraw = new Date(now);
        nextDraw.setHours(nextDraw.getHours() + 1);
        nextDraw.setMinutes(0);
        nextDraw.setSeconds(0);
        nextDraw.setMilliseconds(0);

        const delay = nextDraw.getTime() - now.getTime();
        this.timeout = setTimeout(() => this.draw(), delay);
    }

    async draw() {
        // Previne múltiplos sorteios simultâneos
        if (this.isDrawing) {
            this.schedule();
            return;
        }
        
        this.isDrawing = true;
        
        try {
            // Busca os dados da rifa e verifica se existem rifas compradas
            const rifaData = await RifaModel.findOne({});
            if (!rifaData?.rifa_user?.length) {
                console.log('No tickets in the raffle');
                this.schedule();
                this.isDrawing = false;
                return;
            }

            // Verifica se já houve um sorteio recente (nos últimos 30 segundos)
            const lastDrawTime = rifaData.lastDrawTime || 0;
            const now = Date.now();
            if (now - lastDrawTime < 30000) { // 30 segundos
                console.log('Draw attempted too soon after last draw');
                this.schedule();
                this.isDrawing = false;
                return;
            }
            
            // Atualiza o timestamp do último sorteio
            await RifaModel.updateOne({}, { $set: { lastDrawTime: now } });
            
            // Seleciona um ticket aleatório entre todas as rifas compradas
            const winnerIndex = Math.floor(Math.random() * rifaData.rifa_user.length);
            const winner = rifaData.rifa_user[winnerIndex];
            
            // Calcula o prêmio total baseado no número total de rifas vendidas
            const totalTickets = rifaData.rifa_user.length;
            const prize = RIFA_CONFIG.PRICE * totalTickets; // Prêmio baseado no total de rifas

            console.log(`Drawing winner: ${winner.user_id}, Prize: ${prize}, Total tickets: ${totalTickets}`);
            
            // Adiciona as moedas ao ganhador (apenas uma vez)
            await LunarModel.findOneAndUpdate(
                { user_id: winner.user_id },
                { $inc: { coins: prize } },
                { new: true, upsert: true }
            );

            try {
                // Busca o usuário ganhador
                const user = await this.client.users.fetch(winner.user_id);
                
                if (user) {
                    // Envia mensagem privada ao ganhador
                    try {
                        const dm = await user.createDM();
                        await dm.send(i18next.t('rifa.winner_announcement', {
                            user: user.username,
                            prize,
                            total_tickets: totalTickets,
                            lng: 'pt-BR'
                        }));
                    } catch (dmError) {
                        console.error('Failed to send DM to winner:', dmError);
                    }
                    
                    // Envia apenas UMA mensagem ao canal configurado
                    try {
                        const channel = await this.client.channels.fetch(RIFA_CONFIG.CHANNEL_ID);
                        
                        if (channel) {
                            await channel.send({
                                content: [
                                    `🎉 RESULTADO DO SORTEIO 🎉`,
                                    ``,
                                    `Parabéns <@${winner.user_id}>! Você ganhou o sorteio da rifa.`,
                                    `💰 Prêmio: ${prize} lunnar coins`,
                                    `🎟️ Total de rifas vendidas: ${totalTickets}`,
                                    ``,
                                    `Congratulations <@${winner.user_id}>! You won the raffle draw.`,
                                    `💰 Prize: ${prize} lunnar coins`,
                                    `🎟️ Total tickets sold: ${totalTickets}`
                                ].join('\n')
                            });
                        }
                    } catch (channelError) {
                        console.error('Failed to send announcement:', channelError);
                    }
                    
                    // Limpa TODAS as rifas e registra o ganhador
                    await RifaModel.updateOne(
                        {}, 
                        { 
                            $set: { 
                                rifa_user: [], // Remove todas as rifas
                                last_rifa_prize: prize, 
                                rifa_winner: winner.user_id, 
                                rifa_winner_username: user.displayName 
                            }
                        }
                    );
                    
                    // Limpa todas as entradas de rifa da tabela de usuários
                    await RifaUserModel.updateMany(
                        {}, 
                        { $set: { rifa_user: [] } }
                    );

                    console.log('Raffle draw completed successfully');
                }
            } catch (userError) {
                console.error('Error processing winner user:', userError);
            }
        } catch (error) {
            console.error('Error in raffle draw:', error);
        } finally {
            this.isDrawing = false; 
            this.schedule(); 
        }
    }
}

module.exports = RifaDrawSystem;