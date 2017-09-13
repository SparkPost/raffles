const router = require('express').Router()

router.post('/', (req, res) => {
  res.send('Relay Webhook Acceptor')
})

module.exports = router
