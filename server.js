'use strict'

var express = require('express')
var mongoose = require('mongoose')
var bodyParser = require('body-parser')
var Quote = require('./model/quotes')

var app = express()
var router = express.Router()

var port = process.env.API_PORT || 3001
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

mongoose.connect('mongodb://localhost/qover-exercise')

app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, HEAD,OPTIONS,POST,PUT,DELETE'
  )
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Access-Control-Allow-Headers, Origin, Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers'
  )
  res.setHeader('Cache-Control', 'no-cache')
  next()
})
router.get('/', function(req, res) {
  res.json({ message: 'API INITIALIZED!'})
})

router.route('/quotes')
  .get(function(req, res) {
    Quote.find(function(err, quotes) {
      if (err) {
        res.json(err)
      } else {
        res.json(quotes)
      }
    })
  })
  .post(function(req, res) {
    var quote = new Quote(),
        { user, brand, carPrice, rejected, offer } = req.body,
        date = Date.now()
    quote.user = user || null
    quote.brand = brand || null
    quote.carPrice = carPrice || null
    quote.rejected = rejected || null
    quote.offer = offer || null
    quote.date = date || null
    quote.save(function(err) {
      if (err) {
        res.json(err)
      } else {
        res.json({ message: 'Quote added succesfully' })
      }
    })
  })

app.use('/api', router)
app.listen(port, function() {
  console.log(`api running on port ${port}`)
})