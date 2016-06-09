## SparkPost Developer Hub Raffles

This is a small app that consumes inbound email from the [sparkies](http://github/com/Sparkpost/sparkies) relay webhook database and interprets it as a set of raffle entries.

Each recipient address localpart represents a raffle and each received email represents an entrant to that raffle.

For example, when the app receives the following email:

```
From: bob@entrant.com
To: winstuff@raffle.sparkpost.com
Subject: Pick Me!
```

...it interprets it as an entry to the `winstuff` raffle by `bob@entrant.com`.

##Prerequisites
- Node (tested on 0.12)
- PostgreSQL
- Heroku toolbelt (optional)

## Installation/Configuration/Running Locally

```bash
$ git clone http://github.com/Sparkpost/raffles
```

### Using Heroku

Find the Sparkies app's heroku-postgresql addon name:

```bash
$ heroku addons
```

Create a Heroku app, attach the Sparkies heroku-postgresql addon, configure the app and push:
```bash
$ heroku create
$ heroku addons:attach <sparkies heroku-postgresql addon name> -a <your app name> --as WEBHOOK_CONSUMER_DB
$ heroku config:set RCPT_DOMAIN=raffle.sparkpost.com
$ git push heroku master
```

You can now access the app from https://<your-app-domain>/raffles

### Running Locally

Create a local sparkies database.  Note: this creates a Postgres DB named `avocadomail`:
```bash
psql < tools/avocadomail.sql
```

Create a .env file with the following values:
```bash
export WEBHOOK_CONSUMER_DB_URL="postgres://<your_user>@localhost/avocadomail"
export SPARKPOST_API_KEY=<YOUR_API_KEY>
export RCPT_DOMAIN=hey.avocado.industries
```

Source the .env file and start the app locally:
```bash
source .env
npm run web
```

You can also run the `dev` command to set a watcher on files to restart the server on every save:
```bash
npm run dev
```

### API Usage
Note: all endpoints support `from` and `to` query date/time parameters to narrow their focus to a particular time window.
If the JS Date type can parse it, you can use it in `from` or `to`.

e.g.:

```bash
$curl -s 'http://localhost:5000/raffles?from=2015-01-01&to=2015-02-01' | jq .
```

`/raffles` - list raffles:
```bash
$ curl -s http://localhost:5000/raffles | jq .
```
```json
{
  "results": [
    {
      "localpart": "dgray",
      "cnt": "2"
    },
    {
      "localpart": "ewan",
      "cnt": "1"
    }
    ]
}
'''

`/raffles/:raffleId` - summarise entries for a raffle:
```bash
$ curl -s http://localhost:5000/raffles/dgray | jq .
```
```json
{
"results": {
"num_entries": "2",
  "first_received": "2016-01-26T16:46:30.982Z",
    "last_received": "2016-01-26T16:46:30.984Z"
  }
}
```

`/raffles/:raffleId/winner` - pick a winning entrant for a given raffle:
```bash
$ curl -s http://localhost:5000/raffles/dgray/winner | jq .
```
```json
{
  "results": {
    "winner_address": "dgray@sparkpost.com",
    "winner_sent_at": "2016-01-26T16:46:30.984Z"
  }
}
```

