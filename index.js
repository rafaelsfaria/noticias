const path = require('path')
const express = require('express')
const session = require('express-session')
const mongoose = require('mongoose')

const User = require('./models/user')
const news = require('./routes/news')
const restrict = require('./routes/restrict')

const app = express()
mongoose.Promise = global.Promise
const mongoUri = process.env.MONGODB || 'mongodb://localhost/noticias'
const port = process.env.PORT || 3000

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.use(session({
  name: 'sessionId',
  secret: 'noticias-devpleno',
  saveUninitialized: true,
  resave: true
}))

app.use(express.static('public'))

app.get('/', (req, res) => res.render('index'))
app.use('/noticias', news)
app.use('/restrito', (req, res, next) => {
  if ('user' in req.session) {
    return next()
  }
  res.send('precisa logar')
})
app.use('/restrito', restrict)

const createInitialUser = async () => {
  const total = await User.countDocuments({ username: 'Rafael Faria' })
  if (total === 0) {
    const user = new User({
      username: 'Rafael Faria',
      password: '123456'
    })
    await user.save()
    console.log('user saved')
  } else {
    console.log('skipped')
  }
}

mongoose
  .connect(mongoUri, { useUnifiedTopology: true, useNewUrlParser: true })
  .then(() => {
    createInitialUser()
    app.listen(port, () => console.log('listening...'))
  })
  .catch((e) => console.log('Não foi possível conectar no mongodb:', e))
