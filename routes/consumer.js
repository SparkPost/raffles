'use strict';

var q = require('q')
  , router = require('express').Router()
  , relayMessage = require('../models/relayMessage');

module.exports = router;

router.post('/', function(req, res) {
  res.sendStatus(200);
  var batch = req.body;
  for(var i=0; i<batch.length; i++) {
    relayMessage.create(batch[i].msys.relay_message).then(function() {
      console.log('Added message from ' + batch[i].mys.relay_message.msg_from + ' to DB');
    });
  }
});