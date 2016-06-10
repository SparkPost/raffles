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

### Configuration

This app uses the following environment variables for configuration. 

| Variable | Example | Description |
| -------- | ------- | ----------- |
| SPARKPOST_API_KEY | 42188099814736e582812b07a4e0bd2d | Your SparkPost API key |
| WEBHOOK_CONSUMER_DB | postgres://<your_user>@localhost/avocadomail | The path to your Postgres install |
| RCPT_DOMAIN | hey.avocado.industries | The `to` domain used to query raffle results |
| BA_USERNAME | sparkpostisamazing | The username to use for basic auth |
| PASSWORD_HASH | 60b1198f6b6f25fd67f7856e92923231 | md5 hash of your basic auth password | 


### Using Heroku

Find the Sparkies app's heroku-postgresql addon name:

```bash
$ heroku addons
```

Create a Heroku app, attach the Sparkies heroku-postgresql addon, configure the app and push:
```bash
$ heroku create
$ heroku addons:attach <sparkies heroku-postgresql addon name> -a <your app name> --as WEBHOOK_CONSUMER_DB
$ git push heroku master
```

Set the other environment variables with the `heroku config:set` command.

You can now access the app from `https://<your-app>.herokuapp.com`

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
export BA_USERNAME=<username for basic auth>
export PASSWORD_HASH=<md5 hash of your basic auth password>
```

You can use the `md5it.js` command line tool to generate your password hash:

```
node tools/md5it YOUR_PASSWORD
```

Source the .env file and install dependencies:
```bash
source .env
npm install
```

Start the app locally:
```bash
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
$curl -u myusername:mypassword -s 'http://localhost:3000/raffles?from=2015-01-01&to=2015-02-01' | jq .
```

`/raffles` - list raffles:
```bash
$ curl -u myusername:mypassword -s http://localhost:3000/raffles | jq .
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
$ curl -u myusername:mypassword -s http://localhost:3000/raffles/dgray | jq .
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
$ curl -u myusername:mypassword -s http://localhost:3000/raffles/dgray/winner | jq .
```
```json
{
  "results": {
    "winner_address": "dgray@sparkpost.com",
    "winner_sent_at": "2016-01-26T16:46:30.984Z"
  }
}
```

