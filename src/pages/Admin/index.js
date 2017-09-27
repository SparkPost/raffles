import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import instance from '../../helpers/axios'
import { Page, Tabs } from '@sparkpost/matchbox'
import RaffleCard from '../../components/RaffleCard'

class AdminPage extends Component {
  constructor (props) {
    super(props)
    this.state = { raffles: [], selectedTab: 0 }
  }

  componentWillMount () {
    instance.get('raffles?status=active')
      .then(response => {
        console.log(response.data.results)
        this.setState({ raffles: response.data.results, selectedTab: 0 })
      })
      .catch(err => {
        console.error(err)
      })
  }

  getRaffles (status, tab) {
    let uri = 'raffles'
    if (status) {
      uri = `${uri}?status=${status}`
    }
    instance.get(uri)
      .then(response => {
        console.log(response.data.results)
        this.setState({ raffles: response.data.results, selectedTab: tab })
      })
      .catch(err => {
        console.error(err)
      })
  }

  render () {
    const raffles = this.state.raffles
    const tabs = [
      {content: 'Active', onClick: () => { this.getRaffles('active', 0) }},
      {content: 'Inactive', onClick: () => { this.getRaffles('inactive', 1) }},
      {content: 'All', onClick: () => { this.getRaffles(null, 2) }}
    ]
    return (
      <div>
        <Page title='Admin' primaryAction={{content: 'Create', Component: Link, to: '/admin/raffles/create'}} />
        <Tabs selected={this.state.selectedTab} tabs={tabs} connectBelow={false} />
        {raffles.map(raffle => (
          <RaffleCard key={raffle.id} {...raffle} />
        ))}
      </div>
    )
  }
}

export default AdminPage
