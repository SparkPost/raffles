import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import instance from '../../helpers/axios'
import { Page } from '@sparkpost/matchbox'

class ViewPage extends Component {
  constructor (props) {
    super(props)
    this.state = { raffle: {} }
  }

  componentWillMount () {
    const { match } = this.props
    instance.get(`raffles/${match.params.id}`)
      .then(response => {
        console.log(response.data.results)
        this.setState({ raffle: response.data.results })
      })
      .catch(err => {
        console.error(err)
      })
  }

  render () {
    return (
      <div>
        <Page title={this.state.raffle.name}
          breadcrumbAction={{content: 'Raffles', Component: Link, to: '/admin/'}}
        />
        <p>{this.state.raffle.description}</p>
      </div>
    )
  }
}

export default ViewPage
