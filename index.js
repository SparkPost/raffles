var express = require('express')
  , bodyParser = require('body-parser')
  , morgan = require('morgan')
  , app = express()
  , raffleRouter = require('./routes/simpleraffles')
  , srv = require('http').Server(app);

app.use(bodyParser.json({
  limit: '100kb'
}));

app.use(morgan('dev'));

app.use('/raffles', raffleRouter);

app.use('/', express.static(__dirname + '/ui/'));

srv.listen(process.env.PORT || 3000, function() {
  console.log('Listening on port ' + srv.address().port);
});

