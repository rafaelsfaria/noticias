const router = require('express').Router()
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const FacebookStrategy = require('passport-facebook').Strategy
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy
const joi = require('../utils/validation')

const User = require('../models/user')

router.use(passport.initialize())
router.use(passport.session())

passport.use(new LocalStrategy(
  function(username, password, done) {
    User.findOne({ username }, function (err, user) {
      if (err) { return done(err) }
      if (!user) { return done(null, false) }
      if (!user.verifyPassword(password)) { return done(null, false) }
      return done(null, user)
    })
  }
))

passport.use(new FacebookStrategy({
  clientID: process.env.FACEBOOK_APP_ID,
  clientSecret: process.env.FACEBOOK_APP_SECRET,
  callbackURL: "http://localhost:3000/facebook/callback"
},
function(accessToken, refreshToken, profile, cb) {
  User.findById({ facebookId: profile.id }, function (err, userDB) {
    if (userDB) {
      return cb(err, userDB)
    } else {
      User.create({ facebookId: profile.id, name: profile.displayName }, (err, user) => {
        return cb(err, user)
      })
    }
  })
}
))

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "http://localhost:3000/google/callback",
},
function(accessToken, refreshToken, profile, cb) {
  User.findById({ googleId: profile.id }, function (err, userDB) {
    if (userDB) {
      return cb(err, userDB)
    } else {
      User.create({ googleId: profile.id, name: profile.displayName }, (err, user) => {
        return cb(err, user)
      })
    }
  })
}
))

passport.serializeUser((user, cb) => {
  cb(null, user.id);
})

passport.deserializeUser((id, cb) => {
  User.findById(id, function (err, user) {
    if (err) { return cb(err); }
    cb(null, user);
  })
})


router.use((req, res, next) => {
  if (req.isAuthenticated()) {
    res.locals.user = req.user
    if (!req.session.role) {
      req.session.role = req.user.roles[0]
    }
    res.locals.role = req.session.role
  }
  next()
})

router.get('/change-role/:role', (req, res) => {
  if (req.isAuthenticated()) {
    if (req.user.roles.includes(req.params.role)) {
      req.session.role = req.params.role
    }
  }
  res.redirect('/')
})

router.get('/login', (req, res) => {
  if (req.isAuthenticated()) {
    res.redirect('/')
  } else {
    res.render('login', { errors: { fields: [] } })
  }
})

router.post('/login', (req, res, next) => {
  try {
    joi.validate(joi.Schemas.login, req.body)
    next()
  } catch (error) {
    res.render('login', { errors: error.errors })
    // console.log(error.errors.fields)
    // res.send(error)
  }
}, passport.authenticate('local', { failureRedirect: '/login', successRedirect: '/' }))

router.get('/facebook', passport.authenticate('facebook'))
router.get('/facebook/callback', passport.authenticate('facebook', {
  failureRedirect: '/login',
  successRedirect: '/'
}))

router.get('/google', passport.authenticate('google', { scope: ['profile'] }));
router.get('/google/callback', passport.authenticate('google', {
  failureRedirect: '/login'
}), (req, res) => res.redirect('/'));

router.get('/logout', (req, res) => {
  req.session.destroy(() => res.redirect('/'))
})

module.exports = router