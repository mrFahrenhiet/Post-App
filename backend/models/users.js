var mongoose = require('mongoose');
var unique = require('mongoose-unique-validator');

var usersSchema = new mongoose.Schema({
  username: {type: String, required: true, unique: true},
  password: {type: String, required: true},
})
usersSchema.plugin(unique);

module.exports = mongoose.model("User", usersSchema);
