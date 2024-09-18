const ApiError = require('../utils/ApiErrors');
const {asyncErrorHandler} = require('../utils/asyncErrorHandler');

const {createHash , compareHash} = require('../services/bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose')
require('dotenv').config();

const User = require('../models/user');
const UserData = require('../models/userData');

exports.login = asyncErrorHandler(async(req,res)=>{
    const {email ,password} = req.body;
    const user = await User.findOne({email:email});
    if(!user)throw new ApiError('email does not exixt!' , 404);
    await compareHash(password ,user.password);
    res.status(201).json({success:true , token:generateToken(user._id ,user.email ,user.name)})
})

exports.signup = asyncErrorHandler(async(req,res)=>{
    const session = await mongoose.startSession()
    try {
        session.startTransaction();
        const {name , email ,password} = req.body;
        if(isNull(name) || isNull(email) || isNull(password))throw new ApiError('invalid input!',400);
        const hash = await createHash(password);
        const user = new User({name,email,password:hash});
        const userData = new UserData({userId:user._id});
        await userData.save({session})
        await user.save({session});
        await session.commitTransaction();
        await session.endSession();
        res.status(201).json({success:true})
    } catch (err) {
        await session.abortTransaction();
        await session.endSession();
        throw new ApiError(err.message ,err.statusCode)
    }
})

function isNull(value){
    return value === '' ?true:false;
}

function generateToken(_id ,email , name){
    return jwt.sign({_id ,email , name} , process.env.TOKENKEY)
}