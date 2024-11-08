const jwt = require('jsonwebtoken')

exports.createJwtToken = (payload) => {
  const token = jwt.sign(payload, '12345', { expiresIn: '12h' })
  return token
}

exports.verifyJwtToken = (token, next) => {
  try {
    const { userId } = jwt.verify(token, '12345')
    return userId
  } catch (err) {
    next(err)
  }
}
