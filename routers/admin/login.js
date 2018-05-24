const express = require('express')
const bodyParser = require('body-parser')
const md5 = require('md5-node')

const Db = require('../../modules/db.js')

const router = express.Router()

router.use(bodyParser.urlencoded({ extended: false }))
router.use(bodyParser.json())

router.get('/', (req, res) => {
  res.render('admin/login')
})

router.post('/doLogin', (req, res) => {
  let userName = req.body.userName
  let password = md5(req.body.password)

  Db.find('productManage', 'user', {
    userName: userName,
    password: password
  }, (doc) => {
    if (doc.length > 0) {
      req.session.userInfo = doc[0]
      res.redirect('/admin/product');
    } else {
      res.send('<script>alert("登录失败");location.href="/admin/login"</script>')
    }
  })
})


router.get('/loginOut',function(req,res){
  req.session.destroy(function(err){

      if(err){
          console.log(err);
      }else{
          res.redirect('/admin/login');
      }
  })
})

module.exports = router