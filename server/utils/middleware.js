const _ = require('lodash')
const Raffle = require('../models/raffle')

const responseHelpers = (req, res, next) => {
  res.sendError = (error) => {
    if (_.isError(error)) {
      error = {
        code: error.code,
        message: error.message
      }
    }

    this.json({ error })
  }

  res.sendResults = (results) => {
    this.json({ results })
  }

  next()
}

const getRaffle = (req, res, next) => {
  const raffleId = req.params.id
  Raffle.findById(raffleId)
    .then(raffle => {
      req.raffle = raffle
      next()
    })
    .catch(() => {
      res.sendStatus(404)
    })
}

module.exports = { responseHelpers, getRaffle }
