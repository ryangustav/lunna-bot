const { Schema } = require("mongoose");
const mongoose = require("mongoose");

const code_redeem = new Schema({
    code: String,
    type: String,
    value: { type: Number, required: false },
    status: { type: Boolean },
    vip: { type: String, required: false },
})

const RedeemModel = mongoose.model('RedeemModel', code_redeem)

module.exports = RedeemModel;