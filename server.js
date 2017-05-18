'use strict'

let express = require('express'),
    cookieParser = require('cookie-parser'),
    cookieSession = require('cookie-session'),
    mongoose = require('mongoose'),
    nodemailer = require('nodemailer'),
    bodyParser = require('body-parser'),
    Quote = require('./model/quotes'),
    app = express(),
    router = express.Router(),
    passport = require('passport'),
    Strategy = require('passport-local').Strategy,
    port = process.env.API_PORT || 3001

let transporter = nodemailer.createTransport({
  sendmail: true,
  newline: 'unix',
  path: '/usr/sbin/sendmail'
})

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

const authUser = (username, password) => {
  // Very naive
  let auth = {}
  users.map(function(o) {
    console.log('user', username)
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
  function(username, password, cb) {
    let auth = authUser(username, password)
    if (auth.fail) {
      return cb(auth.fail, null)
    } else {
      return cb(null, auth.user)
    }
  }
))

// no idea about this, but following the docs

passport.serializeUser(function(user, cb) {
  cb(null, user.id);
});

passport.deserializeUser(function(id, cb) {
  let username = getUsernameById(id)
  if (!username) {
    return cb('Username not found', null)
  } else {
    return cb(null, username)
  }
});

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
  console.log('req', req.locals)
  res.json({ message: 'API INITIALIZED! User: ' + req.user })
})

app.use(passport.initialize())
app.use(passport.session())

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

router.route('/login')
  .get(function(req, res) {
    res.json({ message: 'login fail' })
  })
  .post(
    passport.authenticate('local', { failureRedirect: '/api/login'}),
    function(req, res) {
      //res.redirect('/')
      res.json({ message: 'login success' })
    }
  )

app.use('/api', router)

app.listen(port, function() {
  console.log(`api running on port ${port}`)
})