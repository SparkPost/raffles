const router = require('express').Router()
const inboundRouter = require('./inbound')

router.use('/incoming', inboundRouter)

module.exports = router
