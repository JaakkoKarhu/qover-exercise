import axios from 'axios'
import Alert from 'react-bootstrap/lib/Alert'
import Button from 'react-bootstrap/lib/Button'
import Clearfix from 'react-bootstrap/lib/Clearfix'
import Grid from 'react-bootstrap/lib/Grid'
import Col from 'react-bootstrap/lib/Col'
import FormGroup from 'react-bootstrap/lib/FormGroup'
import FormControl from 'react-bootstrap/lib/FormControl'
import React from 'react'
import { Redirect } from 'react-router-dom'

class Login extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      username: '',
      password: '',
      loginError: false
    }
  }
  handleSubmit = () => {
    const { username, password } = this.state,
          body = { username, password }
    axios.post('http://localhost:3001/api/login', body)
      .then((response) => {
        const { status, user } = response.data.login
        const { login } = this.props
        if (status==='fail') {
          this.setState({ loginError: true })
        } else if (status==='success') {
          login(user)
        }
      })
      .catch((error) => {
        console.log('Error:', error)
      })
  }

  render() {
    const { user } = this.props,
          { loginError } = this.state
    if (user) {
      return <Redirect to="/" />
    } else {
      return (
        <Grid>
          <Col className="center-block"
               style={ { float: 'none' }}
               sm={ 7 }>
            <FormGroup className={ loginError ? 'has-error' : '' }>
              <FormControl placeholder="Enter your username..."
                           onChange={ (e) => this.setState({ username: e.target.value, loginError: false }) }>
              </FormControl>
            </FormGroup>
            <FormGroup className={ loginError ? 'has-error' : '' }>
              <FormControl placeholder="...and your password." 
                           onChange={ (e) => this.setState({ password: e.target.value, loginError: false })}
                           type="password" />
            </FormGroup>
            <Button bsStyle="primary"
                    className="pull-right"
                    onClick={ this.handleSubmit }>
              Login
            </Button>
            <Clearfix />
            {
              loginError
              ? <Alert bsStyle='danger'>Wrong username or password</Alert> 
              : null
            }
          </Col>
        </Grid>
      )
    }
  }
}

export default Login;