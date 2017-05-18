'use strict'

let express = require('express'),
    mongoose = require('mongoose'),
    nodemailer = require('nodemailer'),
    bodyParser = require('body-parser'),
    Quote = require('./model/quotes'),
    app = express(),
    router = express.Router(),
    port = process.env.API_PORT || 3001

let transporter = nodemailer.createTransport({
  sendmail: true,
  newline: 'unix',
  path: '/usr/sbin/sendmail'
})

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
// Ugly block
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
    let quote = new Quote(),
        { userName, brand, carPrice, rejected, offer } = req.body,
        date = Date.now()
    quote.userName = userName || null
    quote.brand = brand || null
    quote.carPrice = carPrice || null
    quote.rejected = rejected
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

router.route('/emailer')
  .post(function(req, res) {
    transporter.sendMail({
      from: 'jaakko.exercise@qover.com',
      to: 'jaakko.st.karhu@gmail.com',
      subject: 'Testing',
      text: 'Success, if you see this'
    }, (err, info) => {
      // Don't return errors IRL
      if (err) {
        res.json({ Error: err })
      } else {
        const { envelope, messageId } = info
        res.json({ envelope, messageId })
      }
    })
  })

app.use('/api', router)
app.listen(port, function() {
  console.log(`api running on port ${port}`)
})