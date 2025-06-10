const jwt = require('jsonwebtoken')

exports.createJwtToken = (payload) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '48h' })
  return token
}

exports.verifyJwtToken = (token) => {
  try {
    const { userId } = jwt.verify(token, process.env.JWT_SECRET)
    return userId
  } catch (err) {
    return null;
  }
}
