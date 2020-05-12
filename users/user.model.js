const mongoose = require('mongoose')
const Schema = mongoose.Schema

const portfolioSchema = new Schema({
    code: { type: String, unique: true, require: true, sparse: true },
    createDate: { type: Date, default: Date.now }
})

const schema = new Schema({
    username: { type: String, unique: true, require: true },
    role: { type: String, default: 'member' },
    hash: { type: String, required: true },
    firstName: { type: String, require: true },
    lastName: { type: String, require: true },
    createDate: { type: Date, default: Date.now },
    subscribe: [{
        code: { type: String },
        alarmPrice: { type: String },
        createDate: { type: Date, default: Date.now }
    }]
})

schema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('User', schema);