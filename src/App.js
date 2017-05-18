import axios from 'axios'
import Col from 'react-bootstrap/lib/Col'
import Grid from 'react-bootstrap/lib/Grid'
import Login from './components/Login'
import OfferCounter from './components/OfferCounter'
import React, { Component } from 'react'
import Topbar from './components/Topbar'
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

  logout = () => {
    this.setState({ user: null })
  }

  render() {
    const { initialized, user } = this.state
    if (initialized) {
      return (
        <Router>
          <div className="App">
            <Topbar user={ user }
                    logout={ this.logout } />
            <Grid>
              <Col className="center-block"
                 style={ { float: 'none' }}
                 lg={ 5 }
                 md={ 6 }
                 sm={ 7 }>
              <Route exact path="/"
                     component={
                      () => <OfferCounter user={ user } />
                     } />
              <Route path="/login"
                     component={
                      () => <Login user={ user } login={ this.login } />
                     } />
              </Col>
            </Grid>
          </div>
        </Router>
      );
    } else {
      return <div />
    }
  }
}

export default App;
