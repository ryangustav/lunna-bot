const { Schema } = require("mongoose");
const mongoose = require("mongoose");

const level_role = new Schema({
    guild_id: Number,
    enable: Boolean,
    role: {},
})

const RoleModel = mongoose.model('LevelRole', level_role)

module.exports = RoleModel;