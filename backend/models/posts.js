var mongoose = require('mongoose');

var postsSchema = new mongoose.Schema({
  postTitle: {type: String, required: true},
  postContent: {type: String, required: true},
  imagePath: {type: String}
})

module.exports = mongoose.model("Post", postsSchema);
