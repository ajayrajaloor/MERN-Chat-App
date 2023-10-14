const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const jwt = require('jsonwebtoken')
const bodyParser = require('body-parser');
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
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({
    credentials:true,
    origin : process.env.CLIENT_URL,
}))
 
app.get('/test', (req,res)=>{
    res.json('test ok')

})

app.post('/register', async (req,res)=>{
    const  {username,password} = req.body;
    try{
        const createdUser =  await UserModel.create({username,password})
        jwt.sign({userId:createdUser,_id},jwtSecret, {}, (err,token)=>{
            if(err) throw err;
            res.cookie('token',token).status(201).json({
                _id : createdUser._id,
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