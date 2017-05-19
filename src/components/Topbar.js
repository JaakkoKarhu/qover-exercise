import axios from 'axios'
import Button from 'react-bootstrap/lib/Button'
import Navbar from 'react-bootstrap/lib/Navbar'
import React from 'react'

class TopBar extends React.Component {
  constructor(props) {
    super(props)
  }

  logoutHandler = () => {
    axios.get('http://localhost:3001/api/logout')
      .then((response) => {
        const { logout } = this.props
        logout()
      })
      .catch((error) => {
        //
      })
  }

  render() {
    const { user } = this.props
    if (user) {
      return (
        <Navbar>
          <Button className='pull-right btn-sm btn-outline'
                  onClick={ this.logoutHandler }>
            Logout
          </Button>
        </Navbar>
      )
    } else {
      return null
    }
  }
}

export default TopBar