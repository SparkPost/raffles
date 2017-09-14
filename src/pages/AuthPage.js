import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import auth from '../helpers/auth'
import { Panel, Button, Banner } from '@sparkpost/matchbox'

class AuthPage extends Component {
  constructor (props) {
    super(props)
    this.state = { redirectToReferrer: false }
  }

  componentDidMount () {
    const { match } = this.props
    if (auth.loggedIn) {
      this.setState({ redirectToReferrer: true })
    }
    if (match.params.token) {
      console.log('got token')
      auth.login(match.params.token)
      this.setState({ redirectToReferrer: true })
    }
  }

  render () {
    const errMsg = this.props.match.params.errMsg
    const { from } = this.props.location.state || { from: { pathname: '/' } }
    const { redirectToReferrer } = this.state

    if (redirectToReferrer) {
      return <Redirect to={from} />
    }

    return (
      <div>
        { errMsg && <Banner title={errMsg} status='danger' /> }
        <Panel sectioned accent title='Log In'>
          <Button submit primary to='http://localhost:3001/auth/google'>
            Log In with Google
          </Button>
        </Panel>
      </div>
    )
  }
}

export default AuthPage
