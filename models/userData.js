const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const schema = new Schema({
    highestScore:{type:Schema.Types.Number,require:true ,default:0},
    totalScore:{type:Schema.Types.Number,require:true ,default:0},
    matches:{type:Schema.Types.Number,require:true ,default:0},
    userId:{ type: Schema.Types.ObjectId, ref: 'user' },
})

module.exports = mongoose.model('userData',schema);