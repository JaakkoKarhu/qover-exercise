'use strict'

const express = require('express'),
      cookieParser = require('cookie-parser'),
      cookieSession = require('cookie-session'),
      mongoose = require('mongoose'),
      nodemailer = require('nodemailer'),
      bodyParser = require('body-parser'),
      Quote = require('./model/quotes'),
      app = express(),
      router = express.Router(),
      passport = require('passport'),
      { Strategy } = require('passport-local'),
      port = process.env.API_PORT || 3001

const users = [
  {
    username: 'jaakko.st.karhu@gmail.com',
    password: 'guest',
    id: 1
  },
  {
    username: 'contact@qover.me',
    password: 'guest',
    id: 2
  }
]

let transporter = nodemailer.createTransport({
  sendmail: true,
  newline: 'unix',
  path: '/usr/sbin/sendmail'
})

const authUser = (username, password) => {
  // Very naive
  let auth = {}
  users.map(function(o) {
    if (o.username===username) {
      if (o.password===password) {
        auth.user =  {
          username: o.username,
          id: o.id
        }
      } else {
        auth.fail = 'Wrong password.'
      }
    }
  })
  if (!auth.user) {
    auth.fail = 'User not found.'
  }
  return auth
}

const getUsernameById = (id) => {
  let username
  users.map((o) => {
    if (o.id === id) {
      username = o.username
    }
  })
  return username
}

passport.use(new Strategy(
  (username, password, cb) => {
    let auth = authUser(username, password)
      return cb(null, auth.user)
  }
))

// no idea about this, but following the docs

passport.serializeUser(function(user, cb) {
  cb(null, user.id);
});

passport.deserializeUser((id, cb) => {
  let username = getUsernameById(id)
  if (!username) {
    return cb('Username not found', null)
  } else {
    return cb(null, username)
  }
})

mongoose.connect('mongodb://localhost/qover-exercise')

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(cookieParser())

app.use(cookieSession({
  name: 'qover-exercise-session',
  maxAge: 24 * 60 * 60 * 1000,
  secret: 'very_secret'
}))

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
  res.json({ message: 'API INITIALIZED!' })
})

app.use(passport.initialize())
app.use(passport.session())

router.route('/emailer')
  .post((req, res) => {
    const { driverName, brand, carPrice, offer, email } = req.body,
          subject = `Insurance for your ${ brand }`,
          text =
`${ driverName ? 'Dear ' + driverName : 'Hello there' },

we confirm that you have bough an insurance contract for your ${ brand }, which value is ${ carPrice }

The price to be paid is ${ offer }.

Best regards,

QOVER`
    transporter.sendMail({
      from: 'jaakko.exercise@qover.com',
      to: email,
      subject,
      text
    }, (err, info) => {
      if (err) {
        res.json({ Error: err })
      } else {
        const { envelope, messageId } = info
        res.json({ envelope, messageId })
      }
    })
  })

router.route('/login')
  .get((req, res) => {
    res.json({ login: { status: 'fail' }})
  })
  .post(
    passport.authenticate('local', { failureRedirect: '/api/login' }),
    (req, res) => {
      res.json({
        login: {
          status: 'success',
          user: req.user
        }
      })
    }
  )

router.route('/logout')
  .get((req, res) => {
    req.logout()
    res.json({ message: 'Logged out' })
  })

router.route('/user')
  .get((req, res) => {
    res.json({ user: req.user || null })
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
    const quote = new Quote(),
          { driverName, brand, carPrice, rejected, offer } = req.body,
          date = Date.now()

    quote.driverName = driverName || null
    quote.brand = brand || null
    quote.carPrice = carPrice || null
    quote.rejected = rejected
    quote.offer = offer || null
    quote.date = date || null

    quote.save((err) => {
      if (err) {
        res.json(err)
      } else {
        res.json({ message: 'Quote added succesfully' })
      }
    })
  })

app.use('/api', router)

app.listen(port, () => {
  console.log(`api running on port ${port}`)
})