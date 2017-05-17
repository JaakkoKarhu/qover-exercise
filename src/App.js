import React, { Component } from 'react';
import Alert from 'react-bootstrap/lib/Alert';
import Button from 'react-bootstrap/lib/Button';
import ControlLabel from 'react-bootstrap/lib/ControlLabel';
import Col from 'react-bootstrap/lib/Col';
import Clearfix from 'react-bootstrap/lib/Clearfix';
import FormControl from 'react-bootstrap/lib/FormControl';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import Grid from 'react-bootstrap/lib/Grid';
import Select from 'react-select';
import Row from 'react-bootstrap/lib/Row';
import './App.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'react-select/dist/react-select.css';

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

const rejectReasons = {
  priceRange: 'Allowed price range for the car is between 5.000€ and 75.000€.',
  missingBrand: 'Enter maker of the car.',
  missingPrice: 'Enter price of the car.'
}

class App extends Component {
  constructor(props) {
    super(props)
    this.state={
      // Nested component state is clumsy, but reducer would be an overkill
      inputs: {
        name: { value: null, reject: false },
        brand: { value: null, reject: false  },
        price: { value: '', reject: false }
      }
    }
  }

  handleBrandChange = (value) => {
    let inputs = { ...this.state.inputs }
    inputs.brand = { value, reject: false }
    this.setState({ inputs })
  }

  getErrorMessages = () => {
    const { inputs } = this.state
    let messages = []
    Object.keys(inputs).forEach((key) => {
      const reject = inputs[key].reject
      if (reject) {
        let elem = <p key={ key }>{reject}</p>
        messages.push(elem)
      }
    })
    if (messages.length>0) {
      return <Alert bsStyle='danger'>{ messages }</Alert>
    } else {
      return null
    }
  }

  handleNameChange = (value) => {
    let inputs = { ...this.state.inputs }
    inputs.name.value = value
    this.setState({ inputs })
  }

  handlePriceChange = (value) => {
    let inputs = { ...this.state.inputs }
    if (isNaN(value)||(value.length===1&&value==='0')) {
      return
    } else if ((value.length===1&&value>7)||value>75000) {
      let reject =  rejectReasons.priceRange
      inputs.price = { value, reject }
    } else {
      let reject = false;
      inputs.price = { value, reject }
    }
    this.setState({ inputs })
  }

  handleSubmit = () => {
    const { brand, price } = this.state.inputs
    let inputs = { ...this.state.inputs }
    if (!brand.value) {
      inputs.brand.reject = rejectReasons.missingBrand
    }
    if (!price.value) {
      inputs.price.reject = rejectReasons.missingPrice
    } else if (price.value<5000||price.value>75000) {
      inputs.price.reject = rejectReasons.priceRange
    }
    this.setState({inputs})
  }

  render() {
    const { brand, price } = this.state.inputs
    return (
      <div className="App">
        <Grid>
          <Col className="center-block"
               sm={ 6 }>
            <FormGroup>
              <ControlLabel>
                Name of the driver
              </ControlLabel>
              <FormControl placeholder="First name, last name"
                           onChange={ (e) => this.handleNameChange(e.target.value) } />
            </FormGroup>
            <FormGroup className={ brand.reject ? 'has-error' : '' }>
              <ControlLabel>
                Car brand
              </ControlLabel>
              <Select value={ brand.value }
                      clearable={ false }
                      options={ carOptions }
                      onChange={ this.handleBrandChange }>
              </Select>
            </FormGroup>
            <FormGroup className={ price.reject ? 'has-error' : '' }>
              <ControlLabel>
                Price at the time of purchase (including VAT)
              </ControlLabel>
              <FormControl placeholder="5.000-75.000€"
                           value={ price.value }
                           onChange={ (e) => this.handlePriceChange(e.target.value) } />
            </FormGroup>
            <FormGroup>
              <Button bsStyle="success"
                      className="pull-right"
                      onClick={ this.handleSubmit }>
                Get price!
              </Button>
            </FormGroup>
            <Clearfix />
            { this.getErrorMessages() }
          </Col>
        </Grid>
      </div>
    );
  }
}

export default App;
