const asyncHandler = require('express-async-handler')
require('dotenv').config()
const mongoose = require('mongoose')
const Memories = require('../models/memories')

//Memories_Image
const memory_img = asyncHandler(async (req, res) => {
    const user_email = req.body.user_email
    const name = req.body.name
    const memory_img = req.body.memory_img
    console.log(memory_img)
    const User = await Memories.find({ user_email: user_email }).exec()
    try {
      if (!User?.length) {
        const NewUser = await Memories.create({ user_email, name })
        const addImage = await Memories.findOneAndUpdate(
          { _id: NewUser._id },
          { $push: { memory_img: memory_img } },
        )
  
        return res.send({ message: 'Image Uploaded Successfully.' })
      }
      try {
        const addImage = await Memories.findOneAndUpdate(
          { _id: User[0]._id },
          { $push: { memory_img: memory_img } },
        )
      } catch (err) {
        console.log(err)
      }
  
      return res.send({ message: 'Image Upload Successfully.' })
    } catch (err) {
      console.log(err)
    }
  })

  module.exports = {memory_img}