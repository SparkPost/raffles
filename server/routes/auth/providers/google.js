const router = require('express').Router()
const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy
const emailDomain = process.env.AUTH_EMAIL_DOMAIN || '*'
const _ = require('lodash')

// TODO temporary
let config = {
  api_base: 'http://localhost:3001'
}

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${config.api_base}/auth/google/callback`
    },
    (accessToken, refreshToken, profile, done) => {
      console.log(profile)
      let email = _.get(profile, 'emails.0.value') || ''

      if (_.last(email.split('@')) !== emailDomain && emailDomain !== '*') {
        return done(new Error(`Email must be at ${emailDomain}`))
      }

      // TODO create token using jwt
      done(null, {profile: profile})
    }
  )
)

router.get(
  '/',
  passport.authenticate('google', {
    session: false,
    scope: ['profile', 'email'],
    access_type: 'online',
    hd: process.env.AUTH_EMAIL_DOMAIN
  })
)

router.get(
  '/callback',
  passport.authenticate('google', {
    session: false,
    failureRedirect: `${config.api_base}/auth/failed` // TODO Should go to UI Login & Display Error
  }),
  (req, res) => {
    // TODO Should go to UI
    res.redirect(`${config.api_base}/auth/success?id=${req.user.profile.id}`)
  }
)

module.exports = router
