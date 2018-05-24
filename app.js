const express = require('express')
const session = require('express-session')

//引入模块

const index = require('./routers/index')
const admin = require('./routers/admin')

const app = new express()

app.use(session({
  secret: 'qinjt',
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 1000 * 60 * 30
  },
  rolling: true
}))

//使用ejs模板引擎   默认找views这个目录
app.set('view engine','ejs');
//配置静态目录
app.use(express.static('public'))
app.use('/upload', express.static('upload'))


app.use('/', index)
app.use('/admin', admin)

app.listen(3000, '127.0.0.1')