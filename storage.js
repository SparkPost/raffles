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
  return pgp(this.dburl).none("INSERT INTO spraffles.email (body) VALUES ($1)",
      [body]);
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

