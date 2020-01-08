const express = require('express')
const News = require('../models/news')

const router = express.Router()

router.use('/', (req, res, next) => {
  if ('user' in req.session) {
    return next()
  }
  res.redirect('/login')
})
router.get('/noticias', async (req, res) => {
  const news = await News.find({ category: 'private' })
  res.render('news/restrict', { news })
})

module.exports = router