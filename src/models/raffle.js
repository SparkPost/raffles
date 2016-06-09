'use strict';

var db = require('../lib/db')
  , _ = require('lodash')
  , q = require('q')
  , rfc822Parser = require('../lib/rfc822Parser')
  , rcptDomain = process.env.RCPT_DOMAIN;

function addClause(clauses, args, field, op, value) {
  if (value) {
    args.push(value);
    clauses.push(field + ' ' + op + ' $' + args.length);
  }
}

function toWhereStr(clauseName, clauses) {
  if (clauses.length > 0) {
    return clauseName + ' ' + clauses.join(' AND ') + ' ';
  }
  return ' ';
}

function addCreatedClauses(where, args, from, to) {
  addClause(where, args, 'created', '>=', from);
  addClause(where, args, 'created', '<', to);
}

module.exports.listRaffles = function(from, to) {
  var where = []
    , args = [];

  addCreatedClauses(where, args, from, to);
  args.push(rcptDomain);

  return db().manyOrNone("SELECT SUBSTRING(smtp_to, 0, POSITION('@' IN smtp_to)) AS localpart, COUNT(*) AS cnt " +
    "FROM request_dump.relay_messages " +
    toWhereStr('WHERE', where) +
    "GROUP by smtp_to HAVING smtp_to LIKE '%' || $" + args.length,
    args
  );
};

module.exports.getRaffle = function(from, to, localpart) {
  var where = ["smtp_to = $1 || '@' || $2"]
    , args = [localpart, rcptDomain];

  addCreatedClauses(where, args, from, to);

  return db().one(
    "SELECT COUNT(*) AS num_entries, MIN(created) AS first_received, MAX(created) as last_received " +
    "FROM request_dump.relay_messages " +
    toWhereStr('WHERE', where),
    args
  );
};

module.exports.pickWinner = function(from, to, localpart) {
  var where = ["smtp_to = $1 || '@' || $2"]
    , args = [localpart, rcptDomain];

  addCreatedClauses(where, args, from, to);

  return db().oneOrNone("SELECT smtp_from AS winner_address, created AS winner_sent_at " +
    "FROM request_dump.relay_messages " +
    toWhereStr('WHERE', where) +
    "OFFSET FLOOR(RANDOM()*(SELECT COUNT(*) FROM request_dump.relay_messages WHERE smtp_to = $1 || '@' || $2)) " +
    "LIMIT 1",
    args);
};

module.exports.listEntries = function(from, to, localpart) {
  var where = ["smtp_to like $1 || '@%'"]
    , args = [localpart];

  addCreatedClauses(where, args, from, to);

  return db().manyOrNone(
    "SELECT smtp_from as from, created as received, subject, rfc822 " +
    "FROM request_dump.relay_messages " +
    toWhereStr('WHERE', where) +
    "ORDER BY created ASC",
    args
  ).then(function(rows) {
    // adds decoded RFC822 content to each row
    return q.all(_.map(rows, function(row) {
      return rfc822Parser.parse(row.rfc822)
        .then(function(content) {
          row.content = content;
          delete row.rfc822;
          return row;
        })
        .catch(function(err) {
          console.log(err);
        });
    }));
  });
};
