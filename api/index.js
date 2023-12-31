const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const UserModel = require("./models/userModel");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const ws = require("ws")

dotenv.config();
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  // useFindAndModify: false,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function () {
  console.log("Connected successfully");
});
const jwtSecret = process.env.JWT_SECRET;
const bcryptSalt = bcrypt.genSaltSync(10);

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({  
    credentials: true,
    origin: process.env.CLIENT_URL,
  })
);

app.get("/test", (req, res) => {
  res.json("test ok");
});

app.get("/profile", (req, res) => {
  const token = req.cookies?.token;
  if (token) { 
    jwt.verify(token, jwtSecret, {}, (err, userData) => {
      if (err) throw err;
      res.json(userData);
    });
  } else {
    res.status(401).json("no token");
  }
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const foundUser = await UserModel.findOne({ username });
  if(foundUser){
    const passOk = bcrypt.compareSync(password,foundUser.password)
    if(passOk){
        jwt.sign({usreId:foundUser._id,username},jwtSecret,{},(err,token)=>{
            res.cookie('token',token,{sameSite:'none', secure : true}).json({
                id:foundUser._id
            })
        })
    }
  }
});

app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  try {
    const hashedPassword = bcrypt.hashSync(password, bcryptSalt);
    const createdUser = await UserModel.create({
      username: username,
      password: hashedPassword,
    });
    jwt.sign(
      { userId: createdUser._id, username },
      jwtSecret,
      {},
      (err, token) => {
        if (err) throw err;
        res.cookie("token", token,{sameSite:'none', secure : true}).status(201).json({
          id: createdUser._id,
        });
      }
    );
  } catch (err) {
    if (err) throw err;
    res.status(500).json("error");
  }
});

const server = app.listen(4000);

// ws = web-socket
// wss = web-socket-server
const wss = new ws.WebSocketServer({server})
wss.on('connection',(connection,req) =>{
  console.log(req.headers);
  const cookies = req.headers.cookie;
  if(cookies){
    const tokenCookieString = cookies.split(';').find(str => str.startsWith('token='))
    if(tokenCookieString){
      const token = tokenCookieString.split('=')[1]
      if(token){
        jwt.verify(token,jwtSecret,{},(err,userData)=>{
          if(err) throw err;
           const {userId,username} = userData;
           connection.userId = userId
           connection.username = username
        })
      }
    }
  }

  // grab all users and see who is online and send to all other clients

  [...wss.clients].forEach(client =>{ // get clients as array
    client.send(JSON.stringify({ //send information that who is in online
      online : [...wss.clients].map(c => ({userId : c.userId,username : c.username}))
    }))
  })
  
})