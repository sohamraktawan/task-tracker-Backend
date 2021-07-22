const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const authroutes = require('./routes/AuthRoutes')
const cookieParser = require('cookie-parser')
require('dotenv').config();
const dotenv = require('dotenv');
const path = require('path')

app.use(cors());
app.use(cookieParser());
app.use(express.json());

const dbURI = process.env.db_connect

mongoose.connect(dbURI,{ useNewUrlParser: true, useUnifiedTopology: true })
.then(res=>{
    console.log("connected to db")
})
.catch(err=>{
    console.log(err);
});

app.use("/", require('./routes/taskRoute'));
app.use(authroutes);


app.listen(process.env.PORT || 3001, ()=>{
    console.log("express running is localhost 3001");
})

app.get('/*',(req, res) => {
    res.sendFile(path.join(__dirname + '/client/build/index.html'))
  })