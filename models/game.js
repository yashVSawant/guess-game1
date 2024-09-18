const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const schema = new Schema({
    latestTarget:{type:Schema.Types.Number},
    attemptsMade:{type:Schema.Types.Number ,require:true ,default:0},
    correctGuesses:{type:Schema.Types.Number ,require:true ,default:0},
    maxAttempts:{type:Schema.Types.Number ,require:true ,default:7},
    score:{type:Schema.Types.Number ,require:true ,default:0},
    isGameOver:{type:Schema.Types.Boolean ,require:true ,default:false},
    playedAt:{type:Schema.Types.Date ,require:true , default: Date.now },
    userId:{ type: Schema.Types.ObjectId, ref: 'user' },
})

module.exports = mongoose.model('game',schema);