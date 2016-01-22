'use strict';

var q = require('q')
  , config = require('config')
  , WebhookEndpoint = require('node-webhook-endpoint').WebhookEndpoint
  , Storage = require('./storage')
  , dburl = process.env.DATABASE_URL || config.get('dburl')
  , db = new Storage({dburl: dburl})
  , storageProvider = {
    storeBatch: function(batch, next) {
      console.log("Received batch: " + JSON.stringify(batch, null, '  '));
      db.storeEmail(batch).then(function() {
        console.log("Batch stored");
        next();
      }).catch(function(err) {
        console.log("Batch storage failed: " + err);
        next(err);
      });
    },

    retrieveBatch: function(next) {
      next(new Error('storageProvider#retrieveBatch unimplemented'));
    },

    releaseBatch: function(id, next) {
      next(new Error('storageProvider#releaseBatch unimplemented'));
    }
  }
  , endpoint = new WebhookEndpoint({
      storageProvider: storageProvider,
      ignoreNonArrayPayloads: false
    });

endpoint.listen(process.env.PORT || 3000);

