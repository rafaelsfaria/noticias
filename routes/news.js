const express = require('express')
const News = require('../models/news')

const router = express.Router()

router.get('/', async (req, res) => {
  const news = await News.find({ category: 'public' })
  res.render('news/index', { news })
})

module.exports = router