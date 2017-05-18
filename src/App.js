import axios from 'axios'
import React, { Component } from 'react'
import Login from './components/Login'
import OfferCounter from './components/OfferCounter'
import './App.css'
import {
  BrowserRouter as Router,
  Route
} from 'react-router-dom'


class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      initialized: false,
      user: null
    }
  }

  componentWillMount = () => {
    axios.get('http://localhost:3001/api/user')
    .then((response) => {
      this.setState({ initialized: true, user: response.data.user })
    })
    .catch((error) => {
      console.log('Error:', error)
    }) 
  }

  login = (user) => {
    this.setState({ user })
  }

  render() {
    const { initialized, user } = this.state
    if (initialized) {
      return (
        <Router>
          <div className="App">
            <Route exact path="/"
                   component={
                    () => <OfferCounter user={ user } />
                   } />
            <Route path="/login"
                   component={
                    () => <Login user={ user } login={ this.login } />
                   } />
          </div>
        </Router>
      );
    } else {
      return <div />
    }
  }
}

export default App;
