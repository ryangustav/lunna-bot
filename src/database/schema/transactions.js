const { Schema } = require("mongoose");
const mongoose = require("mongoose");

const transactions_schema = new Schema({
    user_id: Number,
    transactions: [{}],
    transactions_ids: [Number],
});

const transactionsModel = mongoose.model('Transactions', transactions_schema);

module.exports = transactionsModel;