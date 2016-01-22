'use strict';

var q = require('q')
  , config = require('config')
  , WebhookEndpoint = require('node-webhook-endpoint').WebhookEndpoint
  , Storage = require('./storage')
  , dburl = process.env.DATABASE_URL || config.get('dburl')
  , db = new Storage({dburl: dburl})
  , storageProvider = {
    storeBatch: function(batch, next) {
      db.storeEmail(batch).then(next).catch(next);
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

endpoint.listen(3000);

