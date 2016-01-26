'use strict';

var q = require('q')
  , pgp = require('pg-promise')({promiseLib: q})
  , assert = require('assert');

function Storage(options) {
  options = options || {};
  this.dburl = options.dburl;
  assert(typeof this.dburl == 'string', 'options.dburl must be defined.');
}

module.exports = Storage;

Storage.prototype.storeEmail = function(body) {
  return pgp(this.dburl).none("INSERT INTO spraffles.email (friendly_from, rcpt_to, body) VALUES ($1, $2, $3)", [
    body.msys.relay_message.friendly_from,
    body.msys.relay_message.rcpt_to,
    JSON.stringify(body)
  ]);
};

//Storage.prototype.openEmailBatch = function(batchid) {
//  pgp(this.dburl).tx(function(txn) {
//    t.manyOrNone('SELECT id FROM raffles.email WHERE batch_id IS NULL ORDER BY 
//  });
//};
//
//Storage.prototype.closeEmailBatch = function(batchid) {
//};
//
//Storage.prototype.storeSavedEmail = function(email) {
//};
//

