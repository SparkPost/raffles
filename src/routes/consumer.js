'use strict';

var router = require('express').Router() // eslint-disable-line new-cap
  , RelayMessage = require('../models/relayMessage')
  , SparkPost = require('sparkpost')
  , client = new SparkPost()
  , logger = require('../lib/logger');

function getTemplate(raffle) {
  var templateId = 'raffle-' + raffle;

  return client.templates.get(templateId)
    .then(() => {
      return templateId;
    })
    .catch(function() {
      return 'raffle-default';
    });
}

function sendConfirmationEmail(data) {
  client.transmissions.send({
    campaign_id: 'raffle-' + data.raffle,
    content: {
      template_id: data.templateId
    },
    substitution_data: data,
    recipients: [{address: {email: data.entryEmail}}]
  })
  .then(() => {
    logger.info('Raffle Confirmation sent to: ', data.entryEmail);
  })
  .catch(err => {
    logger.error(err);
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
          subject: relayEvent.content.subject,
          maskedEmail: data.entryEmail.split('@')[0] + '@email.com'
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
