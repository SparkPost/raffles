import React, { Component } from 'react'
import {
  BrowserRouter as Router,
  Route,
  //Link,
  Redirect,
  Switch,
  withRouter
} from 'react-router-dom'
import auth from './helpers/auth'
import { Button } from '@sparkpost/matchbox'
import ProtectedRoute from './components/ProtectedRoute'
import Header from './components/Header'

import AuthPage from './pages/AuthPage'
import DashboardPage from './pages/Dashboard'

const AuthButton = withRouter(({ history }) => (
  auth.loggedIn() ? (
    <p>
      Welcome! <Button primary onClick={() => {
        auth.logout()
        history.push('/')
      }}>Sign out</Button>
    </p>
  ) : (
    <p>You are not logged in.</p>
  )
))

class App extends Component {
  render() {
    return (
      <Router>
        <div className="App">
          <Header />
          <div className="container container--content">
            <Switch>
              <Route exact path='/' render={() => <Redirect to='/dashboard' />} />
              <Route path='/auth' component={AuthPage} />
              <ProtectedRoute path='/dashboard' component={DashboardPage} />
            </Switch>
            <AuthButton />
          </div>
        </div>
      </Router>
    );
  }
}

export default App
