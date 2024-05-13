const RoleModel = require('../../database/schema/role_level.js')
const LevelModel = require('../../database/schema/level.js')
const calcular_xp = require("../../util/level_roles.js")
module.exports = {
    name: "messageCreate",
    async execute(message, client) {
    if (message.author.bot === true) return
    const roles = await RoleModel.findOne({ guild_id: message.guild.id });
    const user = await LevelModel.findOne({ user_id: message.author.id });
    const random_xp = Math.floor(Math.random() * (75 - 15 + 1)) + 15;
    let xp_earned = false;
    if (xp_earned === true) return


    if (!roles || roles.enable === false) return;
    if (!user) {
    LevelModel.create({ user_id: message.author.id, xp: random_xp })
    xp_earned = true
    setTimeout(() => {
    xp_earned = false
    }, 5000)
    }
    const xp_needed = await calcular_xp(user.level + 1);
    
    user.xp += random_xp
    xp_earned = true
    setTimeout(() => {
    xp_earned = false
    }, 5000)
    if (user.xp >= xp_needed)  {
        const msg = message.reply({ content: `<:gold_donator:1053256617518440478> | Parabéns ${message.author}, você upou para o level ${user.level + 1}`});
        user.level += 1;
        user.save()
        return
    }
    user.save()

    }
}