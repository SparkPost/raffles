const router = require('express').Router()
const passport = require('passport')
const { responseHelpers } = require('../../utils/middleware')
const rafflesRouter = require('./raffles')
const publicRouter = require('./public')

router.use(responseHelpers)

router.use('/public', publicRouter)

rafflesRouter.use(passport.authenticate('bearer', { session: false }))
router.use('/raffles', rafflesRouter)

router.get('/success', (req, res) => {
  console.log('Auth suceeded')
  res.send(`Success! Welcome ${req.user.first_name}`)
})

module.exports = router
