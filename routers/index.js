const express = require('express')

const router = express.Router()

router.get('/', (req, res) => {
  res.send('index')
})

router.get('/product', (req, res) => {
  res.send('product页面')
})

module.exports = router