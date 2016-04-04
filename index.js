var express = require('express')
  , bodyParser = require('body-parser')
  , passport = require('passport')
  , morgan = require('morgan')
  , app = express()
  , raffleRouter = require('./routes/simpleraffles')
  , consumerRouter = require('./routes/consumer')
  , auth = require('./auth')
  , srv = require('http').Server(app);

app.use(bodyParser.json({
  limit: '100kb'
}));

app.use(passport.initialize());

app.use(morgan('dev'));

app.use('/incoming', consumerRouter);

app.use('/raffles', auth, raffleRouter);

app.use('/', express.static(__dirname + '/ui/'));

srv.listen(process.env.PORT || 3000, function() {
  console.log('Listening on port ' + srv.address().port);
});

