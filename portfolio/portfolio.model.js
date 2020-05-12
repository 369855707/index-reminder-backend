const mongoose = require('mongoose')
const Schema = mongoose.Schema

const portfolioSchema = new Schema({
    code: { type: String, unique: true, require: true },
    targetPrice: { type: Number, require: true },
    createDate: { type: Date, default: Date.now },
    updateDate: { type: Date, default: Date.now }
})

schema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Portfolio', schema);