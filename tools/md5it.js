'use strict';

var md5 = require('md5');

if (process.argv.length < 3) {
  console.log('Usage: ' + process.argv[1] + ' <text>');
  console.log('Calculates the MD5 hash of the given argument');
} else {
  console.log(md5(process.argv[2]));
}

