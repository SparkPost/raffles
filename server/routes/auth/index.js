const router = require('express').Router()
const passport = require('passport')
const BearerStrategy = require('passport-http-bearer').Strategy
const googleAuthRouter = require('./providers/google')
const jwtHelper = require('../../utils/jwtHelper')
const User = require('../../models/user')

// Allows us to use `passport.authenticate('bearer', { session: false })` on API calls
passport.use(new BearerStrategy((token, done) => {
  const payload = jwtHelper.verifyToken(token)
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

module.exports = router
