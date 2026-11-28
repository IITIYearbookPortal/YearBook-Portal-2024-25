const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  googleSubject: {type: String, unique: true, sparse: true},
  name: {
    type: String,
    required: true,
  },
})

module.exports = mongoose.model('Auth', userSchema)
