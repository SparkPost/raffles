'use strict';

var q = require('q')
  , pgPromise = require('pg-promise')
  , pgMonitor = require('pg-monitor')
  , config = require('config')
  , router = require('express').Router()
  , pgOptions = {promiseLib: q}
  , pgp;

pgMonitor.attach(pgOptions);
pgMonitor.detailed = true;
pgp = pgPromise(pgOptions); 

module.exports = router;

function db() {
  return pgp(process.env.HEROKU_POSTGRESQL_CHARCOAL_URL || config.get('maildburl'));
}

function rcptDomain() {
  return process.env.RCPT_DOMAIN || config.get('rcptdomain');
}

router.get('/:raffleId', function(req, res) {
  db().one(
    "SELECT COUNT(*) AS cnt, MIN(created) AS startdate, MAX(created) as enddate FROM request_dump.relay_messages WHERE smtp_to = $1 || '@' || $2",
    [req.params.raffleId, rcptDomain()]
  ).then(function(result) {
    return res.json({
      results: {
        num_entries: result.cnt,
        first_received: result.startdate,
        last_received: result.enddate
      }
    });
  }).fail(function(err) {
    res.status(500).send({errors: [err]});
  });
});

router.get('/:raffleId/winner', function(req, res) {
  db().one("SELECT message_id, smtp_from, smtp_to, subject, created FROM request_dump.relay_messages " +
    "WHERE smtp_to = $1 || '@' || $2 OFFSET FLOOR(RANDOM()*(SELECT COUNT(*) " +
    "FROM request_dump.relay_messages WHERE smtp_to = $1 || '@' || $2)) LIMIT 1",
    [req.params.raffleId, rcptDomain()]
  ).then(function(winner) {
    return res.json({
      results: {
        winner_address: winner.smtp_from,
        winner_sent_at: winner.created
      }
    });
  }).fail(function (err) {
    res.status(500).send({errors: [err]});
  });
});
