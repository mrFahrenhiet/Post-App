var mongoose = require('mongoose');

var postsSchema = new mongoose.Schema({
  postTitle: {type: String, required: true},
  postContent: {type: String, required: true},
  imagePath: {type: String},
  creator: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true}
})

module.exports = mongoose.model("Post", postsSchema);
