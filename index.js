const path = require('path')
const express = require('express')
const app = express()
const mongoose = require('mongoose')

const User = require('./models/user')

mongoose.Promise = global.Promise
const mongoUri = process.env.MONGODB || 'mongodb://localhost/noticias'
const port = process.env.PORT || 3000

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.use(express.static('public'))

app.get('/', (req, res) => res.render('index'))

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
