'use strict';

var express = require('express')
  , bodyParser = require('body-parser')
  , passport = require('passport')
  , morgan = require('morgan')
  , app = express()
  , raffleRouter = require('./routes/simpleraffles')
  , consumerRouter = require('./routes/consumer')
  , auth = require('./lib/auth')
  , logger = require('./lib/logger')
  , srv = require('http').Server(app); // eslint-disable-line new-cap

app.use(bodyParser.json({
  limit: '100kb'
}));

app.use(passport.initialize());

app.use(morgan('dev'));

app.use('/incoming', consumerRouter);

app.use('/raffles', auth, raffleRouter);

app.use('/', express.static(__dirname + '/public/'));

srv.listen(process.env.PORT || 3000, function() {
  logger.info('Listening on port ' + srv.address().port);
});

