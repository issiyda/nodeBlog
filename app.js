// module
const express = require('express')
require('dotenv').config()
require('ejs')
const bodyParser = require('body-parser')
const path = require('path')

// Cookieを読み込むために必要な記述
const cookieParser = require('cookie-parser')

// Sessionを読み込むために必要な記述
const session = require('express-session')

// 文字列のHash化
const bcrypt = require('bcrypt')

const sessionInfo = {
  secret: 'nodePractice',
  //期限を1日に設定
  cookie: { maxAge: 60 * 60 * 24 * 100000 },
  resave: false,
  saveUninitialized: false
}

const app = express()
app.use(cookieParser())
app.use(session(sessionInfo))
// エンコーディングするための処理
app.use(bodyParser.urlencoded({ extended: true }))
// 静的ファイルを用いるための記述
app.use(express.static('public'))
app.set('view engine', 'ejs')
require('ejs')

const port = 3000

app.get('/', (req, res) => {
  res.render('index', {
    name: req.session.login,
    isLogin: req.session.login ? true : false
  })
})

app.use('/blog', require('./routes/blog'))
app.use('/auth', require('./routes/auth'))

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
