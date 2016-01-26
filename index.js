var express = require('express')
  , bodyParser = require('body-parser')
  , morgan = require('morgan')
  , app = express()
  , srv = require('http').Server(app);

app.use(bodyParser.json({
  limit: '100kb'
}));

app.use(morgan('dev'));

app.use('/', express.static(__dirname + '/ui/static/'));

// TODO: query WEBHOOK_CONSUMER_DB
app.get('/api/raffles', function(req, res) {
  res.json([
    {
      smtp_from: "bob@bob.com",
      smtp_to: "elixir@hey.avocado.industries",
      subject: "Gimme da goods!"
    },
    {
      smtp_from: "jim@jim.com",
      smtp_to: "elixir@hey.avocado.industries",
      subject: "I love swag"
    },
    {
      smtp_from: "sue@sue.com",
      smtp_to: "elixir@hey.avocado.industries",
      subject: "Cialis!"
    }
  ]);
});

srv.listen(process.env.PORT || 3000, function() {
  console.log('Listening on port ' + srv.address().port);
});

