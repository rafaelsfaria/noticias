const express = require('express')

const router = express.Router()

router.use('/', (req, res, next) => {
  if ('user' in req.session) {
    return next()
  }
  res.redirect('/login')
})
router.get('/noticias', (req, res) => {
  res.send('noticias restritas')
})

module.exports = router