const router = require('express').Router()

router.get('/', (req, res) => {
  res.send('Google Auth')
})

router.get('/callback', (req, res) => {
  res.send('Google Auth Callback')
})

module.exports = router
