const router = require('express').Router()
const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy
const emailDomain = process.env.AUTH_EMAIL_DOMAIN || '*'
const _ = require('lodash')

// TODO temporary
let config = {
  api_base: 'http://localhost:3000'
}

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID, // TODO
      clientSecret: process.env.GOOGLE_CLIENT_SECRET, // TODO
      callbackURL: `${config.api_base}/auth/callback`
    },
    (accessToken, refreshToken, profile, done) => {
      let email = _.get(profile, 'emails.0.value') || ''

      if (_.last(email.split('@')) !== emailDomain && emailDomain !== '*') {
        return done(new Error(`Email must be at ${emailDomain}`))
      }

      // TODO create token using jwt
    }
  )
)

router.get('/', (req, res) => {
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    access_type: 'online',
    hd: process.env.AUTH_EMAIL_DOMAIN
  })
})

router.get('/callback', (req, res) => {
  passport.authenticate('google', {
    successRedirect: '/admin', // TODO Should go to UI
    failureRedirect: '/' // TODO Should go to UI Login & Display Error
  })
})

module.exports = router
