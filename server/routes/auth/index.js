const router = require('express').Router()
const passport = require('passport')
const BearerStrategy = require('passport-http-bearer').Strategy
const googleAuthRouter = require('./providers/google')
const jwt = require('jsonwebtoken')
const User = require('../../models/user')

// TODO temporary
let config = {
  jwt_secret: 'purplemonkeydishwasher'
}

// Allows us to use `passport.authenticate('bearer', { session: false })` on API calls
passport.use(new BearerStrategy((token, done) => {
  const payload = jwt.verify(token, config.jwt_secret)
  console.log(payload)
  User.findById(payload.user_id)
    .then(user => {
      if (!user) {
        return done(null, false)
      }

      return done(null, user)
    })
    .catch(err => {
      return done(err)
    })
}))

router.use('/google', googleAuthRouter)

router.get('/failed', (req, res) => {
  console.log('Auth failed')
  res.write('whoops!')
  res.end()
})

router.get('/success', (req, res) => {
  console.log('Auth suceeded')
  res.write('Success!')
  res.end()
})

module.exports = router
