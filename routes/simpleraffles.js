'use strict';

var q = require('q')
  , config = require('config')
  , router = require('express').Router()
  , Raffle = require('../models/raffle')
  , _ = require('lodash');

module.exports = router;

router.get('/', function(req, res) {
  Raffle.listRaffles(req.query.from, req.query.to).then(function(lst) {
    return res.json({
      results: lst.map(function(raffle) {
        raffle.count = parseInt(raffle.cnt);
        delete raffle.cnt;
        return raffle;
      })
    });
  }).fail(errorHandler(res));
});

router.get('/:raffleId', function(req, res) {
  Raffle.getRaffle(req.query.from, req.query.to, req.params.raffleId).then(function(raffle) {
    raffle.num_entries = parseInt(raffle.num_entries);
    return res.json({ results: raffle });
  }).fail(errorHandler(res));
});

router.get('/:raffleId/winner', function(req, res) {
  Raffle.pickWinner(req.query.from, req.query.to, req.params.raffleId).then(function(winner) {
    if (winner) {
      return res.json({ results: winner });
    }
    return res.json({
      results: null,
      errors: [{ message: "This raffle has no entrants"}]
    });
  }).fail(errorHandler(res));
});

router.get('/:raffleId/entries', function(req, res) {
  Raffle.listEntries(req.query.from, req.query.to, req.params.raffleId).then(function(entries) {
    // return unique email address entries, the oldest is chosen
    res.json({results: _.sortBy(_.uniqBy(entries, 'from'), 'from')});
  }).fail(errorHandler(res));
});

/**
 * Returns an error handler given the response
 * @param res
 * @returns {Function}
 */
function errorHandler(res) {
  return function(err) {
    res.status(500).send({errors: [err]});
  }
}