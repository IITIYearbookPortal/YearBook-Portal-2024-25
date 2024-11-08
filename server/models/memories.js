const mongoose = require('mongoose')

const memoriesSchema = new mongoose.Schema({
  user_email: {
    type: String,
  },

  name: {
    type: String,
  },

  memory_img: [],
})

module.exports = mongoose.model('Memories', memoriesSchema)
