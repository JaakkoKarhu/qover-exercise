import Alert from 'react-bootstrap/lib/Alert'
import axios from 'axios'
import Button from 'react-bootstrap/lib/Button'
import ControlLabel from 'react-bootstrap/lib/ControlLabel'
import Col from 'react-bootstrap/lib/Col'
import Clearfix from 'react-bootstrap/lib/Clearfix'
import FormControl from 'react-bootstrap/lib/FormControl'
import FormGroup from 'react-bootstrap/lib/FormGroup'
import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import Select from 'react-select'
import Row from 'react-bootstrap/lib/Row'
import 'bootstrap/dist/css/bootstrap.css'
import 'react-select/dist/react-select.css'

const carOptions = [
  {
    value: 'audi',
    label: 'Audi',
    insurance: 250,
    percentage: 0.3 },
  {
    value: 'bmw',
    label: 'BMW',
    insurance: 150,
    percentage: 0.4
  },
  {
    value: 'porsche',
    label: 'Porsche',
    insurance: 500,
    percentage: 0.7
  }
]

const rejectReasons = {
  carPriceRange: 'Allowed price range for the car is between 5.000€ and 75.000€.',
  missingBrand: 'Enter maker of the car.',
  missingPrice: 'Enter price of the car.'
}

class OfferCounter extends Component {

  constructor(props) {
    super(props)
    this.state={
      // Nested component state is clumsy, but reducer would be an overkill
      inputs: {
        name: { value: '', reject: false },
        brand: { value: '', reject: false  },
        carPrice: { value: '', reject: false }
      },
      offer: '',
      ordered: false
    }
  }

  countPrice = () => {
    const { brand, carPrice, name } = this.state.inputs,
          // Ok, nested structure gets a bit confusing here
          unformatted = brand.value.insurance + ((brand.value.percentage/100) * carPrice.value),
          offer = new Intl.NumberFormat('en-EN').format(unformatted.toFixed(2)),
          rejected = this.getErrorMessages()!=null,
          body = {
            driverName: name.value,
            brand: brand.value.value,
            carPrice: carPrice.value,
            rejected,
            offer: isNaN(offer) ? '' : offer
          }
    if (!rejected) {
      this.setState({ offer })
    }
    axios.post('http://localhost:3001/api/quotes', body)
      .catch((error) => {
        //
      })
  }

  getErrorMessages = () => {
    const { inputs } = this.state,
          messages = []
    Object.keys(inputs).forEach((key) => {
      const { reject } = inputs[key]
      if (reject) {
        const elem = <p key={ key }>{reject}</p>
        messages.push(elem)
      }
    })
    if (messages.length>0) {
      return <Alert bsStyle='danger'>{ messages }</Alert>
    } else {
      return null
    }
  }

  getFormFooter = () => {
    const { offer, ordered } = this.state
    let button, legend
    if (!offer) {
      legend = null
      button =  (
        <Button bsStyle='primary'
                type='submit'
                className='pull-right full-width'
                onClick={ this.handleGetPriceClick }>
          Get price!
        </Button>
      )
    } else if (offer&&!ordered) {
      legend = <h1>Our offer: <span className='highlight'>{offer}€</span></h1>
      button = (
        <Button bsStyle='success'
                type='submit'
                className='pull-right full-width'
                onClick={ this.handleBuyClick }>
          Buy the insurance!
        </Button>
      )
    } else if (ordered) {
      legend = <h1 className='success'>We have received your order!</h1>
      button = null
    }
    return (
      <Row>
        <Col xs={ 12 }
             className='offer-section'>
          { legend }
        </Col>
        <Col xs={ 12 }
             className='pull-right'>
          { button }
        </Col>
      </Row>
    )
  }

  handleBrandChange = (value) => {
    let inputs = { ...this.state.inputs }
    inputs.brand = { value, reject: false }
    this.setState({ inputs, offer: '', ordered: false })
  }

  handleNameChange = (value) => {
    let inputs = { ...this.state.inputs }
    inputs.name.value = value
    this.setState({ inputs, offer: '', ordered: false })
  }

  handlePriceChange = (value) => {
    let inputs = { ...this.state.inputs }
    if (isNaN(value)||(value.length===1&&value==='0')) {
      return
    } else if ((value.length===1&&value>7)||value>75000) {
      const reject = rejectReasons.carPriceRange
      inputs.carPrice = { value, reject }
    } else {
      const reject = false;
      inputs.carPrice = { value, reject }
    }
    this.setState({ inputs, offer: '', ordered: false })
  }

  handleGetPriceClick = () => {
    const { brand, carPrice } = this.state.inputs
    let inputs = { ...this.state.inputs }
    if (!brand.value) {
      inputs.brand.reject = rejectReasons.missingBrand
    }
    if (!carPrice.value) {
      inputs.carPrice.reject = rejectReasons.missingPrice
    } else if (carPrice.value<5000||carPrice.value>75000) {
      inputs.carPrice.reject = rejectReasons.carPriceRange
    }
    this.setState({ inputs }, this.countPrice)
  }

  handleBuyClick = () => {
    const { brand, carPrice, name } = this.state.inputs,
          { user } = this.props,
          // Ok nested structure gets a bit confusing here
          unformatted = brand.value.insurance + ((brand.value.percentage/100) * carPrice.value),
          offer = new Intl.NumberFormat('en-EN').format(unformatted.toFixed(2)),
          body = {
            driverName: name.value,
            brand: brand.value.value,
            email: user.username,
            carPrice: carPrice.value,
            offer: isNaN(offer) ? '' : offer
          }
    axios.post('http://localhost:3001/api/emailer', body)
      .then((response) => {
        this.setState({ ordered: true })
      })
      .catch((error) => {
        //
    })
  }

  handleSubmit = (e) => {
    /* This could be better organised with the
     * click events, but this is a last minute addition
     */
    e.preventDefault()
    const { ordered, offer } = this.state
    if (!ordered) {
      this.handleGetPriceClick()
    } else if (offer&&!ordered) {
      this.handleBuyClick()
    }
  }

  render() {
    const { brand, carPrice } = this.state.inputs,
          { user } = this.props
    if ( !user ) {
      return <Redirect to='/login' />
    } else {
      return (
        <section>
          <form onSubmit={ this.handleSubmit }>
            <FormGroup>
              <ControlLabel>
                Name of the driver
              </ControlLabel>
              <FormControl placeholder='First name, last name'
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
            <FormGroup className={ carPrice.reject ? 'has-error' : '' }>
              <ControlLabel>
                Price at the time of purchase (including VAT)
              </ControlLabel>
              <FormControl placeholder='5.000-75.000€'
                           value={ carPrice.value }
                           onChange={ (e) => this.handlePriceChange(e.target.value) } />
            </FormGroup>
            { this.getFormFooter() }
            <Clearfix />
            { this.getErrorMessages() }
          </form>
        </section>
      );
    }
  }
};

export default OfferCounter;