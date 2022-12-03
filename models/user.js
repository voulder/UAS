var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({

    unique_id: Number,
    email: String,
    username: String,
    password: {
      type: String,
      required: true,
      bcrypt: true
    }
  }),
  User = mongoose.model('User', userSchema);

projectSchema = new Schema({

    unique_id: Number,
    project: String,
    description: String
  }),
  Project = mongoose.model('Project', projectSchema);

module.exports = User;