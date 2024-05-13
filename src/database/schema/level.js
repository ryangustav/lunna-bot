const { Schema } = require("mongoose");
const mongoose = require("mongoose");

const level_user = new Schema({
    user_id: Number,
    xp: Number,
    level: Number,
})

const LevelModel = mongoose.model('LevelUser', level_user)

module.exports = LevelModel;