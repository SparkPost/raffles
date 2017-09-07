import React from 'react'
import { Redirect, Route } from 'react-router-dom'
import auth from '../helpers/auth'

const ProtectedRoute = ({component: Component, ...rest}) => (
  <Route {...rest} render={(props) => (
      auth.loggedIn() === true
        ? <Component {...props} />
        : <Redirect to={{pathname: '/auth', state: {from: props.location}}} />
    )}
  />
)

export default ProtectedRoute
