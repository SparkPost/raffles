const router = require('express').Router()
const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy
const User = require('../../../models/user')
const emailDomain = process.env.AUTH_EMAIL_DOMAIN || '*'
const _ = require('lodash')
const jwtHelper = require('../../../utils/jwtHelper')

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
      let email = _.get(profile, 'emails.0.value') || ''

      if (_.last(email.split('@')) !== emailDomain && emailDomain !== '*') {
        return done(new Error(`Email must be at ${emailDomain}`))
      }

      // TODO create token using jwt
      User.findByGoogleId(profile.id).then(user => {
        if (user) {
          User.query()
            .updateAndFetchById(user.id, { last_signin: User.knex().fn.now() })
            .then(user => {
              user.token = jwtHelper.createToken(user.id)
              done(null, user)
            })
        } else {
          return User.query()
            .insert({
              google_id: profile.id,
              email: email,
              first_name: _.get(profile, 'name.givenName'),
              last_name: _.get(profile, 'name.familyName'),
              last_signin: User.knex().fn.now()
            })
            .then(user => {
              user.token = jwtHelper.createToken(user.id)
              done(null, user)
            })
            .catch(err => {
              done(err)
            })
        }
      })
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
    res.redirect(
      `${config.api_base}/api/success?access_token=${req.user.token}`
    )
  }
)

module.exports = router
