const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const {mongoDbUrL,PORT} = require('./config/configuraion')
const session = require('express-session');
const path = require('path')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');


const User = require('./models/UserModal');
const adminroutes = require("./routes/adminroutes");
const blogroutes = require('./routes/Blogroutes')
const loginsignup = require('./routes/SignupLoginroutes');


const app = express();
app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use(cors());
// const PORT = 4000;
app.use('/uploads', express.static('uploads'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

mongoose.connect(mongoDbUrL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "Connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
});


app.use(session({
  secret:'anysecret',
  saveUninitialized:true,
  resave:true
}));

app.use("/",loginsignup);



app.get('/users',async(req,res)=>{
  User.find()
    .then((data) => {
      if (data.length > 0) {
        res.status(200).json(data); // Send a 200 OK response with JSON data
      } else {
        res.status(404).json({ error: "No data found" }); // Send a 404 JSON response if no data is found
      }
    })
    .catch((error) => {
      console.error("Error retrieving data:", error);
      res.status(500).json({ error: "Internal Server Error" }); // Send a 500 JSON response for database errors
    });
})



app.use('/dashboard',adminroutes);

app.use('/blogs',blogroutes)

app.listen(PORT, () => {
  console.log("app is listening at " + PORT);
});
