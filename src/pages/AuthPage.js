import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import auth from '../helpers/auth'
import { Panel, Button } from '@sparkpost/matchbox'

class AuthPage extends Component {
  state = {
    redirectToReferrer: false
  }

  handleSubmit = (e) => {
    e.preventDefault()
    auth.login('12345678')
    this.setState({ redirectToReferrer: true })
  }

  render() {
    const { from } = this.props.location.state || { from: { pathname: '/' } }
    const { redirectToReferrer } = this.state

    if (redirectToReferrer) {
      return (
        <Redirect to={from}/>
      )
    }

    return (
      <Panel sectioned accent title='Log In'>
        <form onSubmit={this.handleSubmit}>
          <Button submit primary >Log In</Button>
        </form>
      </Panel>
    )
  }
}

export default AuthPage
