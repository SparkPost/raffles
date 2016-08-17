'use strict';

var router = require('express').Router() // eslint-disable-line new-cap
  , Raffle = require('../models/raffle')
  , qr = require('node-qr-image')
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

router.get('/:raffleId/qr-code.png', function(req, res) {
  var link = 'mailto:' + req.params.raffleId + '@' + process.env.RCPT_DOMAIN
    , size = parseInt(req.query.size || 100)
    , img = null;
  try {
    img = qr.image(link, {size: size});
    res.writeHead(200, {'Content-Type': 'image/png'});
    img.pipe(res);
  } catch (e) {
    res.writeHead(414, {'Content-Type': 'text/html'});
    res.end('<h1>414 Request-URI Too Large</h1>');
  }
});

router.get('/:raffleId/winner', function(req, res) {
  Raffle.pickWinner(req.query.from, req.query.to, req.params.raffleId).then(function(winner) {
    if (winner) {
      return res.json({ results: winner });
    }
    return res.json({
      results: null,
      errors: [{ message: 'This raffle has no entrants'}]
    });
  }).fail(errorHandler(res));
});

router.get('/:raffleId/entries', function(req, res) {

  Raffle.listEntries(req.params.raffleId, {
    from: req.query.from,
    to: req.query.to,
    orderBy: req.query.sort,
    limit: req.query.limit
  }).then(function(entries) {
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
  };
}
