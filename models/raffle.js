'use strict';

var q = require('q')
  , pgMonitor = require('pg-monitor')
  , pgPromise = require('pg-promise')
  , config = require('config')
  , dburl = process.env.DATABASE_URL || config.get('dburl')
  , pgOptions = {promiseLib: q}
  , pgp;

pgMonitor.attach(pgOptions);
pgp = pgPromise(pgOptions); 

module.exports = {
  create: function(model) {
    return pgp(dburl).none('INSERT INTO spraffles.raffle (slug, name, start_time, end_time) VALUES ' +
        '(${slug}, ${name}, ${start_time}, ${end_time})', model);
  },
  list: function() {
    return pgp(dburl).manyOrNone('SELECT * FROM spraffles.raffle');
  },
  get: function(id) {
    return pgp(dburl).oneOrNone('SELECT * FROM spraffles.raffle WHERE id=$1', [id])
  },
  update: function(id, model) {
    model['id'] = id;
    return pgp(dburl).none('UPDATE spraffles.raffle SET ' + 
      'slug=${slug}, name=${name}, start_time=${start_time}, end_time=${end_time} WHERE id=${id}', model);
  }
};

