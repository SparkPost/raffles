'use strict';

var Q = require('q')
  , router = require('express').Router()
  , RelayMessage = require('../models/relayMessage')
  , SparkPost = require('sparkpost')
  , client = new SparkPost();

module.exports = router;

var getTemplate = function(raffle) {
  var deferred = Q.defer();
  var templateId = 'raffle-'+raffle;

  client.templates.find({ id: templateId }, function(err, res) {
    templateId = err ? 'raffle-default' : templateId;
    deferred.resolve(templateId);
  });

  return deferred.promise;
};

var sendConfirmationEmail = function(data) {
  client.transmissions.send({
    transmissionBody: {
      campaignId: 'raffle-' + data.raffle,
      content: {
        template_id: data.templateId
      },
      substitution_data: data,
      recipients: [{ address: { email: data.entryEmail } }]
    }
  }, function(err, res) {
    if (err) {
      console.log(err);
    } else {
      console.log('Raffle Confirmation sent to: ', data.entryEmail);
    }
  });
};

var processRelayMessage = function(relayEvent) {
  var data = {
    entryEmail: relayEvent.msg_from,
    raffle: relayEvent.rcpt_to.split('@')[0]
  };

  getTemplate(data.raffle)
    .then(function(templateId) {
      console.log('Using Template: ' +  templateId);
      data.templateId = templateId;
      return data
    })
    .then(sendConfirmationEmail);
};

router.post('/', function(req, res) {
  var batch = req.body;
  RelayMessage.createMany(batch)
    .then(function() {
      res.sendStatus(200);
    })
    .then(function() {
      for(var i=0; i<batch.length; i++) {
        processRelayMessage(batch[i].msys.relay_message);
      }
    })
    .fail(function(err) {
      console.log('Oh no, something went wrong!');
      console.log(err);
    });
});