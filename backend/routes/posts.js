var express = require('express');
var Posts = require('../models/posts');
var multer = require('multer');
var authVerify = require('../middleware/auth');

var app = express.Router();
const MIME_TYPE_MAP = {
  'image/png' : 'png',
  'image/jpeg' : 'jpeg',
  'image/jpg' : 'jpg'
}
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = "Invalid File Type";
    if(isValid)
    {
      error = null;
    }
    cb(error,'backend/images');
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLowerCase().split(' ').join('-');
    const ext  = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + '-' + Date.now() + '.'+ ext);
  }
})
app.post('',authVerify,multer({storage:storage}).single('image'),(req,res) =>{
  const url = req.protocol + '://' + req.get('host');
  const posts = new Posts({
    postTitle: req.body.postTitle,
    postContent: req.body.postContent,
    imagePath: url + '/images/' + req.file.filename,
    creator: req.userData.id
  })
  posts.save().then(createdData => {
    res.status(201).json({
     message: "data posted successfully",
      post: {
        ...createdData,
        id: createdData._id
      }
    });
  });

});
app.get('',(req,res) =>{
  const pageSize = +req.query.pageSize;
  const currentPage = +req.query.currentPage
  const postQuery = Posts.find();
  let fetchPosts;
  if (pageSize && currentPage) {
    postQuery.skip(pageSize * (currentPage -1)).limit(pageSize);
  }
  postQuery.then(result => {
    fetchPosts = result;
    return Posts.count()
    }).then(count => {
      res.status(200).json({
        message: "Fetched Succsessfully",
        posts: fetchPosts,
        maxCount: count
    });

  })
});
app.delete('/:id', authVerify,(req,res) => {
  Posts.deleteOne({_id: req.params.id, creator: req.userData.id}).then(result => {
    console.log(result);
    if(result.n>0) {
      res.status(200).json({
        message: "Success! Post Deleted",
      });
    } else {
      res.status(401).json({
        message: "Not authorised"});
    }
  })
});
app.put('/:id', authVerify, multer({storage:storage}).single('image'),(req, res) => {
  let imagePath = req.body.imagePath;
  if(req.file) {
    const url = req.protocol + '://' + req.get('host');
    imagePath = url + '/images/' + req.file.filename;
  }
  const posts = new Posts({
    _id: req.params.id,
    postTitle: req.body.postTitle,
    postContent: req.body.postContent,
    imagePath: imagePath,
    creator: req.userData.id
  });
  Posts.updateOne({_id: req.params.id, creator: req.userData.id},posts).then(result => {
    console.log(result);
    if(result.nModified>0) {
    res.status(200).json({
      message: "Success! Post Updated",
      posts: posts
    });
  } else {
    res.status(401).json({
      message: "Not authorised",
    });
  }
  });
});
module.exports = app;
