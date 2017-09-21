const router = require('express').Router()
const Raffle = require('../../models/Raffle')
const logger = require('../../utils/logger')
const _ = require('lodash')
const SparkPost = require('sparkpost')
const client = new SparkPost()

const getTemplate = (raffle) => {
  const { localpart } = raffle
  const templateId = `raffle-${localpart}`

  return client.templates.get(templateId)
    .then(() => {
      raffle.templateId = templateId
      return raffle
    })
    .catch(() => {
      raffle.templateId = 'raffle-default'
      return raffle
    })
}

const sendConfirmationEmail = (entry) => {
  getTemplate(entry.raffle)
    .then(raffle => {
      const { localpart, templateId, name, campaign, email_data } = raffle
      logger.info(`Using Template: ${templateId}`)
      client.transmissions.send({
        campaign_id: `raffle-${localpart}`,
        content: {
          template_id: templateId
        },
        substitution_data: _.merge(email_data, {name, campaign}),
        recipients: [{address: {email: entry.reply_to}}]
      })
      .then(data => {
        logger.info(`Raffle Confirmation sent to: ${entry.reply_to}`)
        return entry
      })
      .catch(err => {
        logger.error('Oh no, something went wrong!')
        logger.error(err.message)
      })
    })
}

const sendExceptionEmail = ({type, email, raffle, message}) => {
  client.transmissions.send({
    campaign_id: 'raffle-exception',
    content: {
      template_id: 'raffle-exception'
    },
    substitution_data: {type, raffle, message},
    recipients: [{address: {email}}]
  })
  .then(data => {
    logger.info(`Raffle Exception ${type} sent to: ${email}`)
  })
  .catch(err => {
    logger.error('Oh no, something went wrong!')
    logger.error(err.message)
  })
}

const processRelayMessage = (relayEvent) => {
  const localpart = relayEvent.rcpt_to.split('@')[0]
  const email = relayEvent.friendly_from || relayEvent.msg_from

  // Prevent Confirmation Loops
  if (localpart === 'confirmation') {
    return
  }

  Raffle
    .findByLocalpart(localpart)
    .then(raffle => {
      return raffle.addEmailEntry({
        email,
        reply_to: email,
        name: relayEvent.content.subject,
        data: {
          email_rfc822: relayEvent.content.email_rfc822
        }
      })
    })
    .then(sendConfirmationEmail)
    .catch(err => {
      const raffle = `${localpart}@${process.env.RCPT_DOMAIN}`
      if (err.message === 'RAFFLE_NOT_FOUND') {
        logger.warn(`Active Raffle for localpart ${localpart} not found.`)
        sendExceptionEmail({
          type: err.message,
          email,
          raffle,
          message: `An active raffle for ${raffle} wasn't found.`
        })
      } else if (err.message === 'DUPLICATE_ENTRY') {
        logger.warn(`Duplicate entry attempt for ${email} in ${localpart} raffle.`)
        sendExceptionEmail({
          type: err.message,
          email,
          raffle,
          message: `It looks like you've alredy entered by emailing: ${raffle}.`
        })
      } else {
        logger.error('Oh no, something went wrong!')
        logger.error(err.message)
      }
    })
}

router.post('/', (req, res) => {
  const batch = req.body

  batch.forEach(item => {
    processRelayMessage(item.msys.relay_message)
  })

  res.sendStatus(200)
})

module.exports = router
