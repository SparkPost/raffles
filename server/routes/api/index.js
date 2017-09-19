const router = require('express').Router()
const { responseHelpers } = require('../../utils/middleware')
const rafflesRouter = require('./raffles')
const publicRouter = require('./public')

router.use(responseHelpers)

router.use('/public', publicRouter)

router.use('/raffles', rafflesRouter)

module.exports = router
