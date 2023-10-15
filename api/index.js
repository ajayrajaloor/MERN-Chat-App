const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')
const UserModel = require('./models/userModel')
const cors = require('cors')

dotenv.config()
mongoose.connect(process.env.MONGO_URL,{
    useNewUrlParser: true,
    // useFindAndModify: false,
    useUnifiedTopology: true
  })

  const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function () {
  console.log("Connected successfully");
});
const jwtSecret = process.env.JWT_SECRET;

const app = express()
app.use(express.json())
app.use(cookieParser())
app.use(cors({
    credentials:true,
    origin : process.env.CLIENT_URL,
}))
 
app.get('/test', (req,res)=>{
    res.json('test ok')

})

app.get('/profile',(req,res) =>{
    const token = req.cookies?.token;
    if(token){
        jwt.verify(token,jwtSecret,{},(err,userData)=>{
            if(err) throw err;
            res.json(userData)
        })
    }else{
        res.status(401).json('no token')
    }
   
})

app.post('/register', async (req,res)=>{
    const  {username,password} = req.body;
    try{
        const createdUser =  await UserModel.create({username,password})
        jwt.sign({userId:createdUser._id,username},jwtSecret, {}, (err,token)=>{
            if(err) throw err;
            res.cookie('token',token).status(201).json({
                id : createdUser._id,
            })
        })
    }catch(err){
        if(err) throw err;
        res.status(500).json('error')
    }
     
})

app.listen(4000,()=>{
    console.log('server running on port 4000');
})