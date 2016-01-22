'use strict';

var q = require('q')
  , pgp = require('pg-promise')({promiseLib: q})
  , config = require('config')
  , chai = require('chai')
  , Storage = require('../../storage')
  , expect = chai.expect;

afterEach('DB cleanup', function(done) {
  pgp(config.get('dburl')).none('DELETE FROM spraffles.email').done(done);
});

describe("Storage", function() {
  describe('storeEmail', function() {
    it('should create a record in spraffles.email', function(done) {
      var self = this
        , head = 'HEAD'
        , body = JSON.stringify({body: 'BODY TEXT'});
      new Storage({dburl: config.get('dburl')}).storeEmail(head, body).then(function() {
        return pgp(config.get('dburl')).one('SELECT * FROM spraffles.email');
      }).then(function(rec) {
        expect(rec.head).to.equal(head);
        expect(JSON.stringify(rec.body)).to.equal(body);
      }).done(done);
    });
  });
});
