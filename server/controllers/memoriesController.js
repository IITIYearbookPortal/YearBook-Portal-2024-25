const asyncHandler = require('express-async-handler')
require('dotenv').config()
const mongoose = require('mongoose')
const Memories = require('../models/memories')

//Memories_Image
const memory_img = asyncHandler(async (req, res) => {
   const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Unauthorized - No token provided' })
    }
    
    const token = authHeader.substring(7) // Remove 'Bearer ' prefix
    const email = jwtutil.verifyJwtToken(token)
    
    if (email === null) {
      return res.status(401).json({ message: 'Invalid token' })
    }
    const user_email = email
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
  
        return res.status(200).json({ message: 'Image Uploaded Successfully.' })
      }
      try {
        const addImage = await Memories.findOneAndUpdate(
          { _id: User[0]._id },
          { $push: { memory_img: memory_img } },
        )
      } catch (err) {
        console.log(err)
      }
  
      return res.status(200).json({ message: 'Image Upload Successfully.' })
    } catch (err) {
      console.log(err)
    }
  })

  module.exports = {memory_img}