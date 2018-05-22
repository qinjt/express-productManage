const express = require('express')
const bodyParser = require('body-parser')
const session = require('express-session')
const md5 = require('md5-node')


const app = new express()

app.set('view engine', 'ejs')

app.use(express.static('public'))
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

app.use(session({
  secret: 'qinjt',
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 1000 * 60 * 30
  },
  rolling: true
}))

const MongoClient = require('mongodb').MongoClient

var dbUrl = 'mongodb://admin:admin@116.85.36.172:27017'

app.use((req, res, next) => {
  if(req.url === '/login' || req.url === '/doLogin') {
    next()
  } else {
    if(session.userInfo && session.userInfo.userName !== '') {
      app.locals['userInfo'] = session.userInfo
      next()
    } else {
      res.redirect('/login')
    }
  }
})

app.get('/', (req, res) => {
  res.send('index')
})

app.get('/login', (req, res) => {
  res.render('login')
})

app.post('/doLogin', (req, res) => {
  let userName = req.body.userName
  let password = md5(req.body.password)

  MongoClient.connect(dbUrl, (err, client) => {
    if(err) {
      console.log('数据库连接失败')
      console.log(err)
      return
    }
    const db = client.db('productManage')
    let result = db.collection('user').find({
      userName: userName,
      password: password
    })
    result.toArray((error, doc) => {
      if(doc.length > 0) {
        session.userInfo = doc[0]
        res.redirect('/product')
      } else {
        res.send('<script>alert("登录失败");location.href="/login"</script>')
      }
      client.close()
    })
  })
})

app.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if(err) console.log(err)
    else {
      res.redirect('/login')
    }
  })
})

app.get('/product', (req, res) => {
  MongoClient.connect(dbUrl, (err, client) => {
    if(err) {
      console.log(err)
      return 
    }
    const db = client.db('productManage')
    let result = db.collection('product').find()
    result.toArray((error, doc) => {
      if(error) console.log(error)
      else {
        res.render('product', {
          list: doc
        })
      }
      client.close()
    })
  })
})

app.get('/productAdd', (req, res) => {
  res.render('productAdd')
})

app.get('/productEdit', (req, res) => {
  res.render('productEdit')
})


app.listen(3000, '127.0.0.1')