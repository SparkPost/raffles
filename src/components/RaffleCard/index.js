import React from 'react'
import { Link } from 'react-router-dom'
import { Panel, Grid, Button } from '@sparkpost/matchbox'
import moment from 'moment'

import './raffleCard.css'

const getStatus = (started_at, ended_at) => {
  let status = 'inactive'
  if (moment(started_at).isAfter()) {
    status = 'scheduled'
  } else if (moment().isAfter(ended_at)) {
    status = 'passed'
  } else if (moment().isBetween(started_at, ended_at) || moment().isAfter(started_at)) {
    status = 'active'
  }
  return status
}

const RaffleCard = ({id, name, description, localpart, started_at, ended_at}) => {
  let status = getStatus(started_at, ended_at)
  return (
    <Panel title={name} className='raffleCard' sectioned
      actions={[
        {content: 'View', Component: Link, to: `/admin/raffles/view/${id}`},
        {content: 'Edit', Component: Link, to: `/admin/raffles/edit/${id}`}]}>
      <Grid>
        <Grid.Column md={3}>
          <div className='raffleCard__leftColumn'>
            <img src={`http://localhost:3001/api/public/raffles/${id}/qr-code.png`} alt='qr-code' />
            <div>{localpart}@raffle.sparkpost.com</div>
          </div>
        </Grid.Column>
        <Grid.Column md={9}>
          <div>{description}</div>
          {started_at && (
            <div>{status === 'scheduled' ? 'Starts' : 'Started'}: {moment(started_at).format('ddd, MMM D YYYY, h:mm a')}</div>
          )}
          {ended_at && (
            <div>{status === 'past' ? 'Ended' : 'Ends'}: {moment(ended_at).format('ddd, MMM D YYYY, h:mm a')}</div>
          )}
          <div>{status}</div>
          <Button primary size='small'>Pick a Winner</Button>
        </Grid.Column>
      </Grid>
    </Panel>
  )
}

export default RaffleCard
