const RoleModel = require('../../database/schema/role_level.js')
const LevelModel = require('../../database/schema/level.js')
const calcular_xp = require("../../util/level_roles.js")
const Discord = require("discord.js");

module.exports = {
    data: new Discord.SlashCommandBuilder()
        .setName("xp")
        .setDescription("「🎉」Faça eu falar algo")
        .setDMPermission(false)
        .addSubcommand(command => 
            command
            .setName('config')
            .setDescription('「⚙️」Configure o sistema de level')
            .addBooleanOption(option => 
                option
                .setName('ativo')
                .setDescription('Se o sistema esta ativo ou não')  
                .setRequired(true)
            )
        ),
    async execute(interaction, client) {
  const subcommand = interaction.options.getSubcommand()
  const guildRoles = await RoleModel.findOne({ guild_id: interaction.guild.id });


if (subcommand === 'config') {
const ativo = interaction.options.getBoolean('ativo')

if (ativo === true) {
if (!guildRoles) {
interaction.reply({ content: `<:simJEFF:1109206099346862140> | Pronto! O sistema de level no servidor foi ativado`, ephemeral: true })
return RoleModel.create({ guild_id: interaction.guild.id, enable: true, roles: {} })

}
guildRoles.enable = true
guildRoles.save();
interaction.reply({ content: `<:simJEFF:1109206099346862140> | Pronto! O sistema de level no servidor foi ativado`, ephemeral: true })
}
if (ativo === false) {
    if (!guildRoles) {
    interaction.reply({ content: `<:simJEFF:1109206099346862140> | Pronto! O sistema de level no servidor foi desativado`, ephemeral: true })
    return RoleModel.create({ guild_id: interaction.guild.id, enable: true, roles: {} })
    
    }
    guildRoles.enable = false
    guildRoles.save();
    interaction.reply({ content: `<:simJEFF:1109206099346862140> | Pronto! O sistema de level no servidor foi desativado`, ephemeral: true })
}
}

    },
};