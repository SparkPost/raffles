const router = require('express').Router()
const passport = require('passport')
const { getRaffle } = require('../../utils/middleware')
const Raffle = require('../../models/Raffle')

router.use(passport.authenticate('bearer', { session: false }))

// ?status={active|inactive}
router.get('/', (req, res) => {
  const { status } = req.query
  const promise = status ? Raffle.findByStatus(status) : Raffle.query()

  promise
    .then(raffles => {
      return res.sendResults(raffles)
    })
    .catch(err => {
      return res.sendError(err)
    })
})

// Return Single Raffle w/ Entries
router.get('/:id', getRaffle, (req, res) => {
  return res.sendResults(req.raffle)
})

// Create
router.post('/', (req, res) => {
  const payload = req.body
  payload.created_by = req.user.id

  if (payload.started_at) {
    payload.started_by = req.user.id
  }

  if (payload.ended_at) {
    payload.ended_by = req.user.id
  }

  Raffle
    .query()
    .insert(payload)
    .then(raffle => {
      return res.sendResults(raffle)
    })
    .catch(err => {
      return res.sendError(err)
    })
})

// Update
router.put('/:id', getRaffle, (req, res) => {
  let { raffle } = req
  const payload = req.body

  if (payload.started_at) {
    payload.started_by = req.user.id
  }

  if (payload.ended_at) {
    payload.ended_by = req.user.id
  }

  raffle
    .update({by: req.user.id, payload})
    .then(raffle => {
      return res.sendResults(raffle)
    })
    .catch(err => {
      return res.sendError(err)
    })
})

// Start (optional)
router.put('/:id/start', getRaffle, (req, res) => {
  let { raffle } = req
  raffle
    .start({by: req.user.id})
    .then(() => {
      return res.sendStatus(204)
    })
    .catch(err => {
      return res.sendError(err)
    })
})

// End (optional)
router.put('/:id/end', getRaffle, (req, res) => {
  let { raffle } = req
  raffle
    .end({by: req.user.id})
    .then(() => {
      return res.sendStatus(204)
    })
    .catch(err => {
      return res.sendError(err)
    })
})

// Pick a winner
router.get('/:id/draw', getRaffle, (req, res) => {
  let { raffle } = req
  raffle
    .pickWinner()
    .then(winner => {
      return res.sendResults(winner)
    })
    .catch(err => {
      return res.sendError(err)
    })
})

// Delete
router.delete('/:id', getRaffle, (req, res) => {
  let { raffle } = req
  raffle
    .$query()
    .delete()
    .then(() => {
      return res.sendStatus(204)
    })
    .catch(err => {
      return res.sendError(err)
    })
})

module.exports = router
