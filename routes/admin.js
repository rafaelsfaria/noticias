const express = require('express')
const News = require('../models/news')

const router = express.Router()

router.use((req, res, next) => {
  if ('user' in req.session) {
    if (req.session.user.roles.indexOf('admin') >= 0) {
      return next()
    } else {
      return res.redirect('/')
    }
  }
  res.redirect('/login')
})
router.get('/', (req, res) => res.send('admin'))
router.get('/noticias', async (req, res) => {
  const news = await News.find({})
  res.render('news/admin', { news })
})

module.exports = router