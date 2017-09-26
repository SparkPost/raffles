import React from 'react'
import { withRouter } from 'react-router-dom'
import './footer.css'
import auth from '../../helpers/auth'

const SignOutLink = withRouter(({ history }) => (
  <a title='Sign out' className='footer__link' onClick={() => {
    auth.logout()
    history.push('/')
  }}>Sign out</a>
))

const Footer = (props) => {
  return (
    <div className='footer'>
      <div className='container clearfix'>
        <nav className='footer__nav'>
          <a href='http://sparkpost.com' className='footer__logoLink' title='SparkPost'>
            <img src='https://www.sparkpost.com/wp-content/themes/jolteon/images/sparkpost-logo.png' alt='' className='logo' />
          </a>
          <div className='float--right'>
            <a href='https://www.sparkpost.com/features' title='Features' className='footer__link'>Features</a>
            <a href='https://www.sparkpost.com/pricing' title='Pricing' className='footer__link'>Pricing</a>
            <a href='https://www.sparkpost.com/blog' title='Blog' className='footer__link'>Blog</a>
            { auth.loggedIn() && (<SignOutLink />)}
          </div>
        </nav>
      </div>
    </div>
  )
}

export default Footer
