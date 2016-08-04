'use strict';

var Q = require('q')
  , router = require('express').Router() // eslint-disable-line new-cap
  , RelayMessage = require('../models/relayMessage')
  , SparkPost = require('sparkpost')
  , client = new SparkPost()
  , logger = require('../lib/logger');

function getTemplate(raffle) {
  var deferred = Q.defer()
    , templateId = 'raffle-' + raffle;

  client.templates.find({id: templateId}, function(err) {
    templateId = err ? 'raffle-default' : templateId;
    deferred.resolve(templateId);
  });

  return deferred.promise;
}

function sendConfirmationEmail(data) {
  client.transmissions.send({
    transmissionBody: {
      campaignId: 'raffle-' + data.raffle,
      content: {
        template_id: data.templateId
      },
      substitution_data: data,
      recipients: [{address: {email: data.entryEmail}}]
    }
  }, function(err) {
    if (err) {
      return logger.error(err);
    }
    logger.info('Raffle Confirmation sent to: ', data.entryEmail);
  });
}

module.exports = function(io) {

  function processRelayMessage(relayEvent) {
    var data = {
      entryEmail: relayEvent.msg_from,
      raffle: relayEvent.rcpt_to.split('@')[0]
    };

    getTemplate(data.raffle)
      .then(function(templateId) {
        logger.info('Using Template: ' + templateId);
        data.templateId = templateId;
        return data;
      })
      .then(sendConfirmationEmail)
      .then(function() {
        io.to(data.raffle).emit('entry', {
          email: data.entryEmail,
          subject: relayEvent.content.subject
        });
      });
  }

  router.post('/', function(req, res) {
    var batch = req.body;
    RelayMessage.createMany(batch)
      .then(function() {
        res.sendStatus(200);
      })
      .then(function() {
        var i;

        for (i = 0; i < batch.length; i++) {
          processRelayMessage(batch[i].msys.relay_message);
        }
      })
      .fail(function(err) {
        logger.error('Oh no, something went wrong!');
        logger.error(err);
        res.sendStatus(500);
      });
  });

  return router;
};
