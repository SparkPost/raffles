const router = require('express').Router()
const passport = require('passport')
const BearerStrategy = require('passport-http-bearer').Strategy
const googleAuthRouter = require('./providers/google')

// Allows us to use `passport.authenticate('bearer', { session: false })` on API calls
passport.use(new BearerStrategy((token, done) => {
  // TODO token check
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
