'use strict';

var router = require('express').Router()
  , Raffle = require('../models/raffle');

module.exports = router;

router.get('/', function(req, res) {
  Raffle.list().then(function(lst) {
    res.json(lst);
  }).fail(function(err) {
    res.json(500, {errors: [err]});
  });
});

router.get('/:raffleId', function(req, res) {
  Raffle.get(req.params.raffleId).then(function(raffle) {
    if (raffle) {
      res.json(raffle);
    } else {
      res.status(404).send({errors: 'Object not found'});
    }
  }).fail(function(err) {
    res.status(500).send({errors: [err]});
  });
});

router.put('/:raffleId', function(req, res) {
  var exists = false;
  Raffle.get(req.params.raffleId).then(function(raffle) {
    exists = raffle !== null;
    if (exists) {
      return Raffle.update(req.params.raffleId, req.body);
    }
    return exists;
  }).then(function() {
    if (exists) {
      res.json({});
    } else {
      res.status(404).send({});
    }
  }).fail(function(err) {
    res.status(500).send({errors: [err]}); 
  });
});

router.post('/', function(req, res) {
  // TODO: validate and filter body elements
  Raffle.create(req.body).then(function() {
    res.status(200).send({});
  }).fail(function(err) {
    res.json(500, {errors: [err]});
  });
});


