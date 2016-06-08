var q = require('q');
var MailParser = require('mailparser').MailParser;
var stream = require('stream');

// make a promise interface
module.exports.parse = q.nfbind(parse);


function parse(content, cb) {
  var parser = new MailParser();

  parser.on('end', function(message) {
    cb(null, message);
  });

  parser.on('error', cb);

  getStreamFromString(content).pipe(parser);
}

function getStreamFromString(str) {
  var s = new stream.Readable();
  s._read = function noop() {};
  s.push(str);
  s.push(null);

  return s;
}