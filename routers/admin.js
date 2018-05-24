const express = require('express')

const router = express.Router()

const login = require('./admin/login')
const product = require('./admin/product')

router.use((req, res, next) => {
  if (req.url === '/login' || req.url === '/login/doLogin') {
    next()
  } else {
    if (req.session.userInfo && req.session.userInfo.userName !== '') {
      req.app.locals['userInfo'] = req.session.userInfo
      next()
    } else {
      res.redirect('/admin/login')
    }
  }
})

router.use('/login', login)
router.use('/product', product)

module.exports = router