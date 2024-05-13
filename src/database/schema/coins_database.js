const { Schema } = require("mongoose");
const mongoose = require("mongoose");

const lunar_coins = new Schema({
  user_id: Number, 
  isVip:{
    type: Boolean, default: false,
  },
  coins: {
    type: Number, default: 0,
  },
  prompts_used: {
    type: Number, default: 0,
  },
})

const LunarModel = mongoose.model("LunarCoins", lunar_coins)

module.exports = LunarModel;