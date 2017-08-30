import React, { Component } from 'react'
import Header from './components/Header'

class App extends Component {
  render() {
    return (
      <div className="App">
        <Header />
        <div className="container container--content">
          Hello
        </div>
      </div>
    );
  }
}

export default App
