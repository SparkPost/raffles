const router = require('express').Router()
const googleAuthRouter = require('./providers/google')

router.use('/google', googleAuthRouter)

router.get('/logout', (req, res) => {
  res.send('Log out')
})

module.exports = router
