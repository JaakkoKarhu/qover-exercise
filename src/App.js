import React, { Component } from 'react';
import 'react-select/dist/react-select.css';
import Button from 'react-bootstrap/lib/Button';
import ControlLabel from 'react-bootstrap/lib/ControlLabel';
import Col from 'react-bootstrap/lib/Col';
import FormControl from 'react-bootstrap/lib/FormControl';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import Grid from 'react-bootstrap/lib/Grid';
import Select from 'react-select';
import './App.css';
import 'bootstrap/dist/css/bootstrap.css';

const carOptions = [
  // Double check these values
  {
    value: 'audi',
    label: 'Audi',
    price: 250,
    percentage: 0.3 },
  {
    value: 'bmw',
    label: 'BMW',
    price: 150,
    percentage: 0.4
  },
  {
    value: 'porsche',
    label: 'Porsche',
    price: 500,
    percentage: 0.7
  },
]

const submitHandler = () => {
  console.log('submit')
}

class App extends Component {
  constructor(props) {
    super(props)
    this.state={
      selectedBrand: null
    }
  }

  brandInputHandler = (val) => {
    this.setState({
      selectedBrand: val
    })
  }

  render() {
    const  { selectedBrand } = this.state
    return (
      <div className="App">
        <Grid>
          <Col className="center-block"
               sm={ 6 }>
            <FormGroup>
              <ControlLabel>
                Name of the driver:
              </ControlLabel>
              <FormControl />
            </FormGroup>
            <FormGroup>
              <ControlLabel>
                Car brand
              </ControlLabel>
              <Select value={ selectedBrand }
                      clearable={ false }
                      options={ carOptions }
                      onChange={ this.brandInputHandler }>
              </Select>
            </FormGroup>
            <FormGroup>
              <ControlLabel>
                Price at the time of purchase (including VAT)
              </ControlLabel>
              <FormControl />
            </FormGroup>
            <Button bsStyle="success"
                    className="pull-right"
                    onClick={ submitHandler }>
              Get price!
            </Button>
          </Col>
        </Grid>
      </div>
    );
  }
}

export default App;
