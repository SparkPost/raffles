## Setup
To setup raffles locally you'll need postgresql with a user with the name of `root` and a blank password.

[Postico](https://eggerapps.at/postico/) is a good visual option for managing your postgres databases. You'll need to create a database named `sparkpost_raffles`. You can use any tool or run the following command.

```sh
echo 'CREATE DATABASE "sparkpost_raffles" with owner=root' | psql
```


## Environment Variables

This application uses Google Auth to handle authentication. You'll need the environment variables described below stored in your `.env` file. Before starting the raffle application up be sure to run `source .env`.

```sh
export AUTH_EMAIL_DOMAIN=@sparkpost.com # leave this off if you don't want to limit it by domain
export GOOGLE_CLIENT_ID= # get this from your google project
export GOOGLE_CLIENT_SECRET= # get this from your google project

```
