import React from 'react'
import './header.css'

const Header = (props) => {
  return (
    <div className="header">
      <div className="container clearfix">
        <div className="text--center">
          <div className="logo">
            <img className="logo__sparkpost" src="https://developers.sparkpost.com/images/logo-sparkpost-white.png" alt="SparkPost Raffles"/>
            <div className="logo__lab">Raffles</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Header
