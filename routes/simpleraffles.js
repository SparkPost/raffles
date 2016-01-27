'use strict';

var q = require('q')
  , pgPromise = require('pg-promise')
  , pgMonitor = require('pg-monitor')
  , config = require('config')
  , router = require('express').Router()
  , Raffle = require('../models/raffle')

module.exports = router;

router.get('/', function(req, res) {
  Raffle.listRaffles(req.query.from, req.query.to).then(function(lst) {
    return res.json({
      results: lst
    });
  }).fail(function(err) {
    res.status(500).send({errors: [err]});
  });
});

router.get('/:raffleId', function(req, res) {
  Raffle.getRaffle(req.query.from, req.query.to, req.params.raffleId).then(function(raffle) {
    return res.json({ results: raffle });
  }).fail(function(err) {
    res.status(500).send({errors: [err]});
  });
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
  }).fail(function (err) {
    res.status(500).send({errors: [err]});
  });
});
