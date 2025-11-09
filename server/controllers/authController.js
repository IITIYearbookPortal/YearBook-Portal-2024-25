const Auth = require('../models/authModel')
const asyncHandler = require('express-async-handler')

const getAllusers = asyncHandler(async (rq, res) => {
  //Get all users from mongodb
  const auths = await Auth.find().lean()

  // if no users
  if (!auths?.length) {
    return res.send({ message: 'No users found' })
  }
  res.json(auths)
})

//Make the below two functions as one
const createUsers = asyncHandler(async (req, res) => {
  const { email, name } = req.body

  //Create and store user
  const auths = await Auth.create({ email, name })

  if (auths) {
    //created
    res.send({ message: 'New User Created' })
  } else {
    res.send({ message: 'Invalid user data recieved' })
  }
})

//Check if the user logged in second time or first time
const checkAuth = asyncHandler(async (req, res) => {
  const email = req.body.email

  const User = await Auth.find({ email: email }).exec()

  if (!User.length) {
    res.send({ message: 'false' })
  } else {
    res.send({ message: 'true' })
  }
})

module.exports = {
  getAllusers,
  createUsers,
  checkAuth,
}
