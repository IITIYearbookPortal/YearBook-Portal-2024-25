const { verifyJwtToken } = require('../utils/token.util.js');

exports.checkToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }
    const token = authHeader.substring(7);
    try {
        const email = verifyJwtToken(token);
        req.tokenEmail = email;
        next();
    } catch (error) {
        return res.status(403).json({ message: 'Unauthorized Access' });
    }   
}