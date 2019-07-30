var express = require('express');
var bcrypt = require('bcrypt');
var jwt  = require('jsonwebtoken');
const Users = require('../models/users');

var app = express.Router();

app.post('/signup', (req,res) => {
  bcrypt.hash(req.body.password, 10).then(hash => {
    const newuser = new Users({
      username: req.body.username,
      password: hash
    });
    newuser.save().then(createdUser => {
      res.status(200).json({
        message: "User Created",
        user: {
          ...createdUser,
          id: createdUser._id
        }
      })
    }).catch(error => {
      res.status(500).json({
        error: error
      })
    })
  })
});
app.post('/login', (req,res) => {
  let fetchedUser;
  Users.findOne({username: req.body.username}).then(user => {
    if(!user)
    {
      return res.status(401).json({
        message: 'username not found'
      })
    }
    fetchedUser = user;
    return bcrypt.compare(req.body.password, user.password);
  }).then(result => {
    if(!result) {
      return res.status(401).json({
        message: 'password incorrect'
      });
    }
    const token = jwt.sign({username: fetchedUser.username, id: fetchedUser._id}, 'this-is-my-secret-i-know-it-should-be-longer', {expiresIn: '1h'})
    res.status(200).json({
      token: token,
      expiresIn: 3600,
      id: fetchedUser._id
    })
  }).catch(err => {
    return res.status(401).json({
      message: 'Auth failed'
    });
  })
})
module.exports = app;
