'use strict';

var db = require('../lib/db')
  , logger = require('../lib/logger')
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

  return db().manyOrNone('SELECT SUBSTRING(smtp_to, 0, POSITION(\'@\' IN smtp_to)) AS localpart, COUNT(*) AS cnt ' +
    'FROM request_dump.relay_messages ' +
    toWhereStr('WHERE', where) +
    'GROUP by smtp_to HAVING smtp_to LIKE \'%\' || $' + args.length,
    args
  );
};

module.exports.getRaffle = function(from, to, localpart) {
  var where = ['smtp_to = $1 || \'@\' || $2']
    , args = [localpart, rcptDomain];

  addCreatedClauses(where, args, from, to);

  return db().one(
    'SELECT COUNT(*) AS num_entries, MIN(created) AS first_received, MAX(created) as last_received ' +
    'FROM request_dump.relay_messages ' +
    toWhereStr('WHERE', where),
    args
  );
};

module.exports.pickWinner = function(from, to, localpart) {
  var args = [localpart, rcptDomain, from, to]
    , query = '' +
        'SELECT lower(smtp_from) AS from, min(created) AS received ' +
          'FROM request_dump.relay_messages ' +
         'WHERE lower(smtp_to) = lower($1 || \'@\' || $2) ' +
           'AND ($3 IS NULL OR created >= $3) ' +
           'AND ($4 IS NULL OR created <  $4) ' +
         'GROUP BY lower(smtp_from) ' +
         'ORDER BY random() ' +
         'LIMIT 1';

  return db().oneOrNone(query, args);
};

module.exports.listEntries = function(localpart, options) {
  var where = ['smtp_to = $1 || \'@\' || $2']
    , args = [localpart, rcptDomain]
    , query;

  options = options || {};
  options.orderBy = options.orderBy || 'created ASC';
  if (!options.orderBy.match(/^\w+(?:\s+(?:asc|desc)\s*)?$/i)) {
    throw new Error('illegal \'order by\' clause');
  }

  addCreatedClauses(where, args, options.from, options.to);

  query = 'SELECT smtp_from as from, created as received, subject, rfc822 ' +
                'FROM request_dump.relay_messages ' +
                toWhereStr('WHERE', where) +
                'ORDER BY ' + options.orderBy;

  if (options.limit) {
    // only allow the specific format we expect
    if (parseInt(options.limit, 0) > 0) {
      query += ' LIMIT ' + options.limit;
    } else {
      // otherwise: bad limit clause, asplode
      throw new Error('illegal \'limit\' clause');
    }
  }

  return db().manyOrNone(query, args)
    .then(function(rows) {
    // adds decoded RFC822 content to each row
      return q.all(_.map(rows, function(row) {
        return rfc822Parser.parse(row.rfc822)
        .then(function(content) {
          row.content = content;
          delete row.rfc822;
          return row;
        })
        .catch(function(err) {
          logger.error(err);
        });
      }));
    });
};
