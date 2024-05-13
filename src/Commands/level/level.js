const { SlashCommandBuilder } = require("discord.js");
const RoleModel = require('../../database/schema/role_level.js')
const LevelModel = require('../../database/schema/level.js')
const calcular_xp = require("../../util/level_roles.js")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("level")
        .setDescription("「🎉」Veja seu level")
        .setDMPermission(false)
        .addUserOption(option => 
            option
            .setName('user')
            .setDescription('usuario que você quer ver o level')
            .setRequired(false)
        ),
    async execute(interaction, client) {
  const user = interaction.options.getUser('user') || interaction.user
  if (!LevelModel.findOne({ user_id: interaction.user.id })) await LevelModel.create({ user_id: user.id, xp: 0, level: 0 })
const user_level = await LevelModel.findOne({ user_id: user.id });

  interaction.reply({ content: `<:gold_donator:1053256617518440478> | ${user} está no level ${user_level.level}, com ${user_level.xp}/${calcular_xp(user_level.level + 1)} xp`, ephemeral: true })
    
    }
};