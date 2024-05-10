const { Schema } = require("mongoose");
const mongoose = require("mongoose");

const rifa_schema = new Schema({
    rifa_user: [{}]
})

const RifaModel = mongoose.model('RifaSchema', rifa_schema)

module.exports = RifaModel;