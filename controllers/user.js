const UserData = require('../models/userData'); 
const Game = require('../models/game')
const {asyncErrorHandler} = require('../utils/asyncErrorHandler');

exports.info = asyncErrorHandler(async(req,res)=>{
    const {_id , name} = req.user;
    const userData = await UserData.findOne({userId:_id});
    res.status(200).json({success:true ,name:name ,data:userData})
})

exports.topTenHighestScore = asyncErrorHandler(async(req,res)=>{
    const {type} = req.params;
    const topTen = await UserData.find()
      .sort({ [type]: -1 }) 
      .limit(10) 
      .populate('userId', 'name');
    res.status(200).json({success:true ,topTen:topTen})
})

exports.pastScores = asyncErrorHandler(async(req,res)=>{
    const {_id} = req.user;
    const pastScore = await Game.find({userId:_id}).limit(10).sort({ playedAt: -1 }).select('score attemptsMade correctGuesses');
    res.status(200).json({success:true , pastScore : pastScore});
})
