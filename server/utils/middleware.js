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

    res.json({ error })
  }

  res.sendResults = (results) => {
    res.json({ results })
  }

  next()
}

const getRaffle = (req, res, next) => {
  const raffleId = req.params.id
  Raffle.findById(raffleId)
    .then(raffle => {
      if (raffle) {
        req.raffle = raffle
        next()
      }
      res.sendStatus(404)
    })
    .catch((err) => {
      res.sendError(err)
    })
}

module.exports = { responseHelpers, getRaffle }
