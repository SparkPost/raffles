'use strict';

var q = require('q')
  , pgp = require('pg-promise')({promiseLib: q})
  , router = require('express').Router();

module.exports = router;

router.get('/:raffleId', function(req, res) {
  pgp(process.env.HEROKU_POSTGRESQL_CHARCOAL_URL).one(
    "SELECT COUNT(*) FROM request_dump.relay_messages WHERE smtp_to = $1 || '@' || $2"
  ).then(function(cnt) {
    return res.json({results: {num_entries: cnt}});
  }).fail(function(err) {
    res.status(500).send({errors: [err]});
  });
});

router.get('/raffleId/winner', function(req, res) {
});
