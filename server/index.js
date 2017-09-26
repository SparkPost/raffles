const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const passport = require('passport')
const app = express()
const authRouter = require('./routes/auth')
const apiRouter = require('./routes/api')
const webhooksRouter = require('./routes/webhooks')
const knex = require('./utils/knex')

if (process.env.NODE_ENV === 'production') {
  knex.migrate.latest()
}

app.set('port', process.env.PORT || 3001)

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use(passport.initialize())

app.use(cors())

app.use('/auth', authRouter)
app.use('/api', apiRouter)
app.use('/webhooks', webhooksRouter)

app.listen(app.get('port'), () => {
  console.log('Express server listening on port ' + app.get('port'))
})
