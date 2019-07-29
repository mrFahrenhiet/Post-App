var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var path = require('path');

const app = express();
const postsRoutes = require("./routes/posts");
const userRoutes = require('./routes/users');
// NEfvT1uAaow0VBPE
mongoose.connect('mongodb+srv://shg:NEfvT1uAaow0VBPE@cluster0-ocwxl.mongodb.net/test?retryWrites=true&w=majority',{ useNewUrlParser: true })
.then(() => {
  console.log("Connected!");
}).catch(() => {
  console.log("Error in connecting")
});

app.use(bodyParser.json());
app.use('/images/', express.static(path.join('backend/images')))
app.use((req,res,next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Reqested-With, Content-Type, Accept, Authorization");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, DELETE, PATCH, OPTIONS, PUT");
  next();
})

app.use("/api/posts", postsRoutes);
app.use("/api/users",userRoutes);
module.exports = app;
