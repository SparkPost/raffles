// pull email from avocado postgres db processed_data
// produce spraffle.entrant entries

var q = require('q')
  , pgPromise = require('pg-promise')
