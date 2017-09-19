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
      if (!raffle) {
        return res.sendStatus(404)
      }
      req.raffle = raffle
      next()
    })
    .catch(err => {
      res.json({
        code: err.code,
        message: err.message
      })
    })
}

module.exports = { responseHelpers, getRaffle }
