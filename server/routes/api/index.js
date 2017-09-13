const router = require('express').Router()
const passport = require('passport')

// Authenticate all API routes
router.use(passport.authenticate('bearer', { session: false }))

module.exports = router
