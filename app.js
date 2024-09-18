const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const {errorHandler} = require('./middlewares/errorHandler');
const {authenticate} = require('./middlewares/authentication');

const authRoute = require('./routes/auth');
const userRoute = require('./routes/user');
const gameRoute = require('./routes/game');

const app = express();

app.use(cors({origin:'http://localhost:3001'}))
app.use(bodyParser.json());
app.use(helmet())

app.use('/api/auth',authRoute);
app.use('/api/user',authenticate,userRoute);
app.use('/api/game',authenticate,gameRoute);

app.use(errorHandler);

app.use('*',(req,res)=>{
    res.status(404).json({success:false , message:'not found!'})
})

mongoose.connect(process.env.MONGO_URL)
.then(()=>{
    app.listen(process.env.PORT || 3000,()=>{
        console.log('running!')
    })
})
.catch((err)=>{console.log(err)})
