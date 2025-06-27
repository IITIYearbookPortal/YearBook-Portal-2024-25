
const jwtutil = require("../utils/token.util");
const Auth = require("../models/authModel");
const asyncHandler = require("express-async-handler");
const { jwt } = require("twilio");
const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client();

const getAllusers = asyncHandler(async (rq, res) => {
  //Get all users from mongodb
  const auths = await Auth.find().lean();

  // if no users
  if (!auths?.length) {
    return res.status(404).json({ message: "No users found" });
  }
  res.status(404).json(auths);
});

const verifyGoogleToken = (token) => {
  // Verify the Google token
  return new Promise((resolve, reject) => {
    client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
    }, (err, ticket) => {
      if (err) {
        return reject(err);
      }
      const payload = ticket.getPayload();
      const email = payload.email;
      const name = payload.name;
      resolve({ email, name });
    });
  });
}

//Make the below two functions as one
const createUsers = asyncHandler(async (req, res) => {
  const googleToken = req.body.googleToken;
  if (!googleToken) {
    return res.status(401).send({ message: "Google token is required" });
  }

  const { email, name } = await verifyGoogleToken(googleToken);

  //Create and store user
  const auths = await Auth.create({ email, name });
  const jwttoken = await jwtutil.createJwtToken({ userId: email });
  if (auths) {
    res.status(200).json({ message: "New User Created", token: jwttoken });
  } else {
    res.status(404).json({ message: "Invalid user data recieved" });
  }
});

//Check if the user logged in second time or first time
const checkAuth = asyncHandler(async (req, res) => {
    const googleToken = req.body.googleToken;
    if (!googleToken) {
      return res.status(400).send({ message: "Google token is required" });
    }
    const { email, name } = await verifyGoogleToken(googleToken);
    const User = await Auth.find({ email: email }).exec();
    if (!User.length) {
      res.status(404).json({ message: "false" });
    } else {
      const jwttoken = await jwtutil.createJwtToken({ userId: email });
      res.status(200).json({ message: "true", token: jwttoken });
    }
});

module.exports = {
  getAllusers,
  createUsers,
  checkAuth,
};
