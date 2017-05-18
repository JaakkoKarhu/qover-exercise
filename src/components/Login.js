import Button from 'react-bootstrap/lib/Button'
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
      password: ''
    }
  }
  handleSubmit = () => {
    console.log('Login.js', '-->>', this.state.username, this.state.password);
  }
  render() {
    const { user } = this.props
    if (user) {
      return <Redirect to="/" />
    } else {
      return (
        <Grid>
          <Col className="center-block"
               style={ { float: 'none' }}
               sm={ 7 }>
            <FormGroup>
              <FormControl placeholder="Enter your username..."
                           onChange={ (e) => this.setState({ username: e.target.value }) }>
              </FormControl>
            </FormGroup>
            <FormGroup>
              <FormControl placeholder="...and your password." 
                           onChange={ (e) => this.setState({ password: e.target.value })}/>
            </FormGroup>
            <Button bsStyle="primary"
                    className="pull-right"
                    onClick={ this.handleSubmit }>
              Login
            </Button>
          </Col>
        </Grid>
      )
    }
  }
}

export default Login;