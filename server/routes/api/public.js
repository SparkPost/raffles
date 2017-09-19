const router = require('express').Router()
const { getRaffle } = require('../../utils/middleware')
const _ = require('lodash')
const qr = require('node-qr-image')

// Single Raffle Public View (entry count)
router.get('/raffles/:id', getRaffle, (req, res) => {
  let results = _.pick(req.raffle, ['id', 'name'])
  results.email = `${req.raffle.localpart}@${process.env.RCPT_DOMAIN}`
  results.count = req.raffle.entries ? req.raffle.entries.length : 0
  res.sendResults(results)
})

// QR Code Generator &size={pixel}
router.get('/raffles/:id/qr-code.png', getRaffle, (req, res) => {
  const link = `mailto:${req.raffle.localpart}@${process.env.RCPT_DOMAIN}`
  const size = parseInt(req.query.size || 100)

  try {
    const img = qr.image(link, { size: size })
    res.writeHead(200, { 'Content-Type': 'image/png' })
    img.pipe(res)
  } catch (err) {
    res.writeHead(414, { 'Content-Type': 'text/html' })
    res.end('<h1>414 Request-URI Too Large</h1>')
  }
})

module.exports = router
