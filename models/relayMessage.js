'use strict';

var db = require('../db');

module.exports = {
  create: function(json) {
    return db().none("INSERT INTO request_dump.relay_messages (webhook_id, smtp_from, smtp_to, subject, rfc822, is_base64) " +
      "VALUES ($1, $2, $3, $4, $5, $6)", [
      json.webhook_id,
      json.msg_from,
      json.rcpt_to,
      json.content.subject,
      json.content.email_rfc822,
      json.content.email_rfc822_is_base64
    ]);
  },
  createMany: function(batch) {
    return db().tx(function(t) {
      var txdb = this;
      return batch.map(function(msg) {
        msg = msg.msys.relay_message;
        return txdb.none("INSERT INTO request_dump.relay_messages (webhook_id, smtp_from, smtp_to, subject, rfc822, is_base64) " +
          "VALUES ($1, $2, $3, $4, $5, $6)", [
          msg.webhook_id,
          msg.msg_from,
          msg.rcpt_to,
          msg.content.subject,
          msg.content.email_rfc822,
          msg.content.email_rfc822_is_base64
        ]);
      });
    });
  }
};