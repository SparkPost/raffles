import React from 'react'
import { Link } from 'react-router-dom'
import { Panel } from '@sparkpost/matchbox'
import moment from 'moment'

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
    <Panel title={name}
      actions={[{content: 'Edit', Component: Link, to: `/admin/raffle/${id}`}]}>
      <div>{description}</div>
      <div>{localpart}@raffle.sparkpost.com</div>
      {started_at && (
        <div>{status === 'scheduled' ? 'Starts' : 'Started'}: {moment(started_at).format('dddd, MMMM Do YYYY, h:mm a')}</div>
      )}
      {ended_at && (
        <div>{status === 'past' ? 'Ended' : 'Ends'}: {moment(ended_at).format('dddd, MMMM Do YYYY, h:mm a')}</div>
      )}
      <div>{status}</div>
    </Panel>
  )
}

export default RaffleCard
