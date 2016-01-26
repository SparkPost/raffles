'use strict';

var q = require('q')
  , pgp = require('pg-promise')({promiseLib: q})
  , config = require('config')
  , chai = require('chai')
  , Storage = require('../../storage')
  , expect = chai.expect
  , testEmailRecords = [require('../data/email1.json')]; 

function db() {
  return pgp(config.get('dburl'));
} 

function storageInst() {
  return new Storage({dburl: config.get('dburl')});
}

function loadEmailRecord(body) {
  return db().query('INSERT INTO spraffles.email (friendly_from, rcpt_to, body) VALUES($1, $2, $3)', [
    body.msys.relay_message.friendly_from, body.msys.relay_message.rcpt_to, JSON.stringify(body)]);
}

function mkTestRecords(tplrec, numrecs) {
  var ret = [];
  for(var i = 0; i < numrecs; ++i) {
    ret.push(tplrec);
  }
  return ret;
}

afterEach('DB cleanup', function(done) {
  db().none('DELETE FROM spraffles.email').done(done);
});

describe("Storage", function() {
  describe('storeEmail', function() {
    it.only('should create a record in spraffles.email', function(done) {
      var self = this
        , body = {msys:{relay_message: {friendly_from: "bob@bob.kom", rcpt_to: "jim@jim.kom"}}, body: 'BODY TEXT'};
      storageInst().storeEmail(body).then(function() {
        return pgp(config.get('dburl')).one('SELECT * FROM spraffles.email');
      }).then(function(rec) {
        expect(JSON.parse(rec.body)).to.deep.equal(body);
      }).done(done);
    });
  });

  describe('pullBatch', function() {
    before('Add test records', function(done) {
      q.all(mkTestRecords(testEmailRecords[0], 10).map(loadEmailRecord)).done(function() {
        done();
      });
    });

    it('should pull up to BATCH_SIZE emails from storage', function(done) {
      var self = this
        , batchSize = 5;

      storageInst().pullBatch(batchSize).then(function(batch) {
        expect(batch).to.have.length(batchSize); 
        batch.map(function(emailrec) {
          expect(emailrec.body).to.equal(testEmailRecords[0]);
        });
      }).done(done);
    });

    it('should pull only records not already a member of a batch');
    it('should return [] when storage is empty');
  });
});
