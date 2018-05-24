const express = require('express')
const multiparty = require('multiparty')
const fs = require('fs')

const Db = require('../../modules/db')

const router = express.Router()

router.get('/', (req, res) => {
  Db.find('productManage', 'product', {}, (doc) => {
    res.render('admin/product/index', {
      list: doc
    })
  })
})

router.get('/add', (req, res) => {
  res.render('admin/product/add')
})

router.post('/doAdd', (req, res) => {
  var form = new multiparty.Form()
  form.uploadDir = 'upload'
  form.parse(req, function(err, fields, files) {
    let title = fields.title[0]
    let price = fields.price[0]
    let fee = fields.fee[0]
    let description = fields.description[0]

    let picUrl = files.pic[0].path

    Db.insert('productManage', 'product', {
      title,
      price,
      fee,
      description,
      picUrl
    }, (doc) => {
      res.redirect('/admin/product')
    })
  });
})

router.get('/edit', (req, res) => {
  let id = req.query.id
  Db.find('productManage', 'product', {
    _id: new Db.ObjectId(id)
  }, (doc) => {
    res.render('admin/product/edit', {
      list: doc
    })
  })
})

router.post('/doEdit', (req, res) => {
  var form = new multiparty.Form()
  form.uploadDir = 'upload'
  form.parse(req, function(err, fields, files) {

    let _id = fields._id[0]
    let title = fields.title[0]
    let price = fields.price[0]
    let fee = fields.fee[0]
    let description = fields.description[0]
    let picUrl = files.pic[0].path

    let originalFilename = files.pic[0].originalFilename

    if(originalFilename) {
      var json = {
        title,
        price,
        fee,
        description,
        picUrl
      }
    } else {
      var json = {
        title,
        price,
        fee,
        description
      }
      fs.unlink(picUrl, (err) => {
        console.log(err)
      })
    }

    
    
    Db.update('productManage', 'product', {
      _id: new Db.ObjectId(_id)
    }, json, (doc) => {
      res.redirect('/admin/product')
    })
  })
})

router.get('/delete', (req, res) => {
  let id = req.query.id
  Db.deleteOne('productManage', 'product', {
    _id: new Db.ObjectId(id)
  }, doc => {
    res.redirect('/admin/product')
  })
})

module.exports = router