const express = require('express')
const News = require('../models/news')

const router = express.Router()

router.get('/', async (req, res) => {
  let news = []
  if (!('user' in req.session)) {
    news = await News.find({ category: 'public' })
  } else {
    news = await News.find({})
  }
  res.render('news/index', { news })
})

module.exports = router