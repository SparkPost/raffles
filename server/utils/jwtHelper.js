const jwt = require('jsonwebtoken')
const jwtSecret = process.env.JWT_SECRET || 'purplemonkeydishwasher'

module.exports = {
  createToken: id => {
    const payload = {
      user_id: id
    }
    return jwt.sign(payload, jwtSecret)
  },
  verifyToken: token => {
    return jwt.verify(token, jwtSecret)
  }
}
