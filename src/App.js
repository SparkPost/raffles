import React, { Component } from 'react'
import {
  BrowserRouter as Router,
  Route,
  // Link,
  Redirect,
  Switch
} from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
import Header from './components/Header'
import Footer from './components/Footer'

import AuthPage from './pages/AuthPage'
import AdminPage from './pages/Admin'
import raffles from './pages/raffles'

class App extends Component {
  render () {
    return (
      <Router>
        <div className='App'>
          <Header />
          <div className='container container--content'>
            <Switch>
              <Route exact path='/' render={() => <Redirect to='/admin' />} />
              <Route exact path='/auth' component={AuthPage} />
              <Route path='/auth/error/:errMsg' component={AuthPage} />
              <Route path='/auth/:token' component={AuthPage} />
              <ProtectedRoute exact path='/admin' component={AdminPage} />
              <ProtectedRoute exact path='/admin/raffles/create' component={raffles.CreatePage} />
              <ProtectedRoute exact path='/admin/raffles/edit/:id' component={raffles.EditPage} />
              <ProtectedRoute exact path='/admin/raffles/view/:id' component={raffles.ViewPage} />
            </Switch>
          </div>
          <Footer />
        </div>
      </Router>
    )
  }
}

export default App
