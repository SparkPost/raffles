const express = require('express')
const bodyParser = require('body-parser')
const app = express()

app.set('port', process.env.PORT || 3001)

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.listen(app.get('port'), () => {
  console.log('Express server listening on port ' + app.get('port'))
})
