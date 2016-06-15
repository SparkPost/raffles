<a href="https://www.sparkpost.com"><img src="https://www.sparkpost.com/sites/default/files/attachments/SparkPost_Logo_2-Color_Gray-Orange_RGB.svg" width="200px"/></a>

[Sign up](https://app.sparkpost.com/sign-up?src=Dev-Website&sfdcid=70160000000pqBb) for a SparkPost account and visit our [Developer Hub](https://developers.sparkpost.com) for even more content.

# SparkPost Raffles App

This is a Node.js app that consumes inbound email from a relay webhook database and interprets it as a set of raffle entries.

Each recipient address localpart represents a raffle and each received email represents an entrant to that raffle.

For example, when the app receives the following email:

```
From: bob@entrant.com
To: winstuff@raffle.sparkpost.com
Subject: Pick Me!
```

...it interprets it as an entry to the `winstuff` raffle by `bob@entrant.com`.

## Prerequisites

- Node (tested on 0.12)
- PostgreSQL
- Heroku toolbelt (optional)

## Installation/Configuration/Running Locally

```bash
$ git clone https://github.com/SparkPost/raffles
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


### Running Locally

Create a local sparkies database.  Note: this creates a Postgres DB named `avocadomail`:
```bash
psql < tools/avocadomail.sql
```

Install dependencies (this will install both NPM and Bower deps):
```bash
npm install
```

Create a .env file with the following values and `source` it:
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

Start the app locally:
```bash
npm run web
```

You can also run the `dev` command to set a watcher on files to restart the server on every save:
```bash
npm run dev
```

## API Usage
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

`/raffles/:raffleId/entries` - details about entries for a raffle:
```bash
$ curl -s http://localhost:5000/raffles/thedude/entries | jq .
```
```json
{
    "results": [
        {
            "content": {
                "date": "2016-01-26T18:46:36.000Z",
                "from": [
                    {
                        "address": "some.dude@sparkpost.com",
                        "name": "Some Dude"
                    }
                ],
                "headers": {
                    "accept-language": "en-US",
                    "content-language": "en-US",
                    "content-type": "multipart/alternative; boundary=\"_000_D2CD6F8920EA2somedudesparkpostcom_\"",
                    "date": "Tue, 26 Jan 2016 18:46:36 +0000",
                    "dkim-signature": "v=1; a=rsa-sha256; c=relaxed/simple; d=sparkpost.com; s=dkim1024; t=1453833998; bh=skhPF1DbeM5zGroj96RyrZ5fgdqbVDMk0cnZMUWQQvU=; h=From:To:Subject:Date:Message-ID; b=W9/6+9E3F0y9oXKrWLb/dbao+AyY77DXs1AxPgn61leURRxxoEgIM4L8O4qHqYApm DnY+fcjIozp90fe6rEd5RYA7saQoICYkCZpO+OJeYkdS5xNukUTFFS7ZwxGqaKYg0m JmUwI7Utnr5FRTUQUsod56YqhVvYaCFFgWGuXHL8=",
                    "from": "Some Dude <some.dude@sparkpost.com>",
                    "message-id": "<D2CD6F89.20EA2%some.dude@sparkpost.com>",
                    "mime-version": "1.0",
                    "received": [
                        "from [204.232.133.73] ([204.232.133.73:53427] helo=a.mx.messagesystems.com) by momentum3.platform1.us-west-2.aws.cl.messagesystems.com (envelope-from <some.dude@sparkpost.com>) (ecelerity 4.2.10.52432 r(Core:4.2.10.0)) with ESMTP id 3B/58-07606-01FB7A65; Tue, 26 Jan 2016 18:46:40 +0000",
                        "from [108.166.43.129] ([108.166.43.129:35088] helo=smtp11.relay.ord1c.emailsrvr.com) by b.mx.messagesystems.com (envelope-from <some.dude@sparkpost.com>) (ecelerity 3.6.0.39694 r(Platform:3.6.0.0)) with ESMTP id C5/B2-28631-E0FB7A65; Tue, 26 Jan 2016 13:46:38 -0500",
                        "from smtp11.relay.ord1c.emailsrvr.com (localhost.localdomain [127.0.0.1]) by smtp11.relay.ord1c.emailsrvr.com (SMTP Server) with ESMTP id 9EBB32804D8 for <thedude@hey.avocado.industries>; Tue, 26 Jan 2016 13:46:38 -0500 (EST)",
                        "from smtp11.relay.ord1c.emailsrvr.com (localhost.localdomain [127.0.0.1]) by smtp11.relay.ord1c.emailsrvr.com (SMTP Server) with ESMTP id 755A528041F for <thedude@hey.avocado.industries>; Tue, 26 Jan 2016 13:46:38 -0500 (EST)",
                        "from smtp192.mex05.mlsrvr.com (unknown [184.106.31.85]) by smtp11.relay.ord1c.emailsrvr.com (SMTP Server) with ESMTPS id 426212804DE for <thedude@hey.avocado.industries>; Tue, 26 Jan 2016 13:46:38 -0500 (EST)",
                        "from smtp192.mex05.mlsrvr.com ([UNAVAILABLE]. [184.106.31.85]) (using TLSv1 with cipher AES256-SHA) by 0.0.0.0:25 (trex/5.5.4); Tue, 26 Jan 2016 13:46:38 -0500",
                        "from ORD2MBX06B.mex05.mlsrvr.com ([fe80::4cba:20ff:fe52:4153]) by ORD2HUB07.mex05.mlsrvr.com ([fe80::d6ae:52ff:fe7f:66a7%15]) with mapi id 14.03.0235.001; Tue, 26 Jan 2016 12:46:37 -0600"
                    ],
                    "return-path": "<some.dude@sparkpost.com>",
                    "subject": "Hiya DevRel!",
                    "thread-index": "AQHRWGnil7lSt1uheEaxS17Z320Kog==",
                    "thread-topic": "Hiya DevRel!",
                    "to": "\"thedude@hey.avocado.industries\" <thedude@hey.avocado.industries>",
                    "x-ms-has-attach": "",
                    "x-ms-tnef-correlator": "",
                    "x-originating-ip": "[86.141.41.165]",
                    "x-sender-id": "some.dude@sparkpost.com",
                    "x-smtpdoctor-processed": "csmtpprox beta"
                },
                "html": "<html>\n<head>\n<meta http-equiv=\"content-type\" content=\"text/html; charset=utf-8\" />\n</head>\n<body style=\"word-wrap: break-word; -webkit-nbsp-mode: space; -webkit-line-break: after-white-space; color: rgb(0, 0, 0); font-size: 14px; font-family: Calibri, sans-serif;\">\n<div>This. Is. A Test.</div>\n<div><br>\n</div>\n</body>\n</html>\n",
                "messageId": "D2CD6F89.20EA2%some.dude@sparkpost.com",
                "priority": "normal",
                "receivedDate": "2016-01-26T18:46:40.000Z",
                "subject": "Hiya DevRel!",
                "text": "This. Is. A Test.\n\n",
                "to": [
                    {
                        "address": "thedude@hey.avocado.industries",
                        "name": ""
                    }
                ]
            },
            "from": "some.dude@sparkpost.com",
            "received": "2016-01-26T18:46:41.272Z",
            "subject": "Hiya DevRel!"
        }
    ]
}

```


## Using Heroku

Create a Heroku app, attach the Sparkies heroku-postgresql addon, configure the app and push:

```bash
$ heroku create
$ heroku addons:create heroku-postgresql -a <your app name>
$ git push heroku master
```

Set the other environment variables with the `heroku config:set` command.

You can now access the app from `https://<your-app>.herokuapp.com`
