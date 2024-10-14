const jwt = require('jsonwebtoken');
require('dotenv').config();

const ApiError = require('../utils/ApiErrors');
const {asyncErrorHandler} = require('../utils/asyncErrorHandler');

const authenticate = asyncErrorHandler(async(req,res,next)=>{
        const fullToken = req.header('Authorization')|| '';
        const token = fullToken.split("Bearer ")[1];
        if(!token)throw new ApiError('unauthorize access!',401);
        const tokenClient =  jwt.verify(token , process.env.TOKENKEY);
        if(!tokenClient)throw new ApiError('invalid token',400);
        req.user = tokenClient;
        next();
})

module.exports = {authenticate};