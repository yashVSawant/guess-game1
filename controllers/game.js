const mongoose = require('mongoose')
const Game = require('../models/game');
const UserData = require('../models/userData');

const ApiError = require('../utils/ApiErrors');
const {asyncErrorHandler} = require('../utils/asyncErrorHandler');

exports.startGame = asyncErrorHandler(async(req,res)=>{
    const {_id} = req.user;
    const randomNumber = +(Math.random()*100).toFixed(0);
    const game = new Game({
        userId:_id , latestTarget:randomNumber
    })
    const hint = randomNumber%10;
    await Promise.all([
        UserData.findOneAndUpdate({userId:_id},{ $inc: { matches: 1 }}),
        game.save()
    ])
    res.status(201).json({success:true ,game:game ,hint:hint})
})

exports.addScore = asyncErrorHandler(async(req,res)=>{
    const {id} = req.params;
    const {guess} = req.body;
    const game = await Game.findOne({_id:id});
    if(!game)throw new ApiError('game not found!',404);
    if(game.isGameOver)throw new ApiError('match is already ended!' , 400);
    const userData = await UserData.findOne({userId:req.user._id});
    let guessValue ;
    if(+guess === game.latestTarget)guessValue = "match";
    else if(+guess > game.latestTarget)guessValue = "high";
    else guessValue = "low";
    const addCorrectGuess = +guess === game.latestTarget ? 1:0;
    game.attemptsMade += 1;
    game.correctGuesses += addCorrectGuess;
    if(addCorrectGuess === 1){
        const randomNumber = +(Math.random()*100).toFixed(0);
        const score = ((1/ +game.attemptsMade).toFixed(2))*100;
        game.score += score;
        game.latestTarget = randomNumber;
        game.maxAttempts += 2;
    }
    if(game.attemptsMade === game.maxAttempts){
        game.isGameOver = true;
    }

    if(userData.highestScore < game.score){
        userData.highestScore = game.score;
        await userData.save()
    }
    const hint = game.latestTarget % 10;
    await game.save();
    const gameClone = { ...game._doc };
    delete gameClone.latestTarget; 
    res.status(200).json({success:true ,game:gameClone ,guess:guessValue ,hint:hint})
})


exports.endGame = asyncErrorHandler(async(req,res)=>{
    const session = await mongoose.startSession()
    session.startTransaction();
    try {
        const {id} = req.params;
        const {_id} = req.user;
        const game = await Game.findOne({_id:id});
        const userData = await UserData.findOne({userId:_id});
        if(!game)throw new ApiError('game not found!',404);
        game.isGameOver = true;
        userData.totalScore += game.score;
        await Promise.all([
            userData.save({session}),
            game.save({session})
        ]);
        await session.commitTransaction();
        await session.endSession();
        res.status(200).json({success:true , game:game})
    } catch (err) {
        await session.abortTransaction();
        await session.endSession();
        throw new ApiError(err.message ,err.statusCode)
    }
})

