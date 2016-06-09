'use strict';

var db = require('../lib/db');

/**
 * Sanitizes data in place
 * @param msg
 */
function sanitize(msg) {
  msg.msg_from = msg.msg_from.toLowerCase();
  msg.rcpt_to = msg.rcpt_to.toLowerCase();
}

module.exports.create = function(msg) {
  sanitize(msg);

  return db().none('INSERT INTO request_dump.relay_messages (webhook_id, smtp_from, smtp_to, subject, rfc822, is_base64) ' +
    'VALUES ($1, $2, $3, $4, $5, $6)', [
      msg.webhook_id,
      msg.msg_from,
      msg.rcpt_to,
      msg.content.subject,
      msg.content.email_rfc822,
      msg.content.email_rfc822_is_base64
    ]);
};

module.exports.createMany = function(batch) {
  return db().tx(function() {
    var txdb = this; // eslint-disable-line consistent-this

    return batch.map(function(msg) {
      msg = msg.msys.relay_message;
      sanitize(msg);

      return txdb.none('INSERT INTO request_dump.relay_messages (webhook_id, smtp_from, smtp_to, subject, rfc822, is_base64) ' +
        'VALUES ($1, $2, $3, $4, $5, $6)', [
          msg.webhook_id,
          msg.msg_from,
          msg.rcpt_to,
          msg.content.subject,
          msg.content.email_rfc822,
          msg.content.email_rfc822_is_base64
        ]);
    });
  });
};
