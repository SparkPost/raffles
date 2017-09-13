const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const authRouter = require('./routes/auth')
const apiRouter = require('./routes/api')
const webhooksRouter = require('./routes/webhooks')

app.set('port', process.env.PORT || 3001)

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use('/auth', authRouter)
app.use('/api', apiRouter)
app.use('/webhooks', webhooksRouter)

app.listen(app.get('port'), () => {
  console.log('Express server listening on port ' + app.get('port'))
})
