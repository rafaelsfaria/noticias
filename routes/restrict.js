const express = require('express')
const News = require('../models/news')

const router = express.Router()

router.use((req, res, next) => {
  if (req.isAuthenticated()) {
    if (req.user.roles.indexOf('restrict') >= 0) {
      return next()
    } else {
      res.redirect('/')
    }
  } else {
    res.redirect('/login')
  }
})
router.get('/', (req, res) => res.send('restrito'))
router.get('/noticias', async (req, res) => {
  const news = await News.find({ category: 'private' })
  res.render('news/restrict', { news })
})

module.exports = router