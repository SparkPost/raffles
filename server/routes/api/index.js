const router = require('express').Router()
const passport = require('passport')

// Authenticate all API routes
router.use(passport.authenticate('bearer', { session: false }))

router.get('/success', (req, res) => {
  console.log('Auth suceeded')
  res.write(`Success! Welcome ${req.user.first_name}`)
  res.end()
})

module.exports = router
