const jwt = require('jsonwebtoken');
require('dotenv').config();

const user = require('../models/user');
const ApiError = require('../utils/ApiErrors');
const {asyncErrorHandler} = require('../utils/asyncErrorHandler');

const authenticate = asyncErrorHandler(async(req,res,next)=>{
        const fullToken = req.header('Authorization')|| '';
        const token = fullToken.split("Bearer ")[1];
        if(!token)throw new ApiError('unauthorize access!',401);
        const tokenClient =  jwt.verify(token , process.env.TOKENKEY);
        const client = await user.findById(tokenClient._id);
        if(!client)throw new ApiError('unauthorize access!',401);
        req.user = client;
        next();
})

module.exports = {authenticate};