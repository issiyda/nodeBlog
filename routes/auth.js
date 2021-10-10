const router = require('express').Router()
const bcrypt = require('bcrypt')
const User = require('../models/user')

router.get('/logout', (req, res) => {
  req.session.login = undefined

  res.redirect('/auth/login')
})

// ログインページ表示
router.get('/login', (req, res) => {
  if (req.session.login) {
    res.redirect('/', { name: req.session.login, isLogin: true })
  }
  res.render('auth/login', {
    error: '',
    email: ''
  })
})

// ログイン
router.post('/login', async (req, res) => {
  try {
    const params = req.body
    const requestPassword = params.password
    const user = await User.findOne({
      where: {
        email: params.email
      }
    })
    console.log('user', user)
    const match = await bcrypt.compare(requestPassword, user.password)
    console.log('match', match)
    if (match) {
      console.log('match')
      req.session.login = user.name
      req.session.userInfo = {
        id: user.id,
        name: user.name
      }
      console.log('session', req.session, req.session.login)
      res.render('index', { name: req.session.login, isLogin: true })
    } else {
      res.render('auth/login', {
        error: 'メールアドレスもしくはパスワードが違います。',
        email: params.email
      })
    }
  } catch (error) {
    res.render('auth/login', {
      error: '入力内容を見直してください'
    })
  }
})

// 新規登録ページ表示
router.get('/register', (req, res) => {
  res.render('auth/register', {
    error: '',
    name: '',
    email: ''
  })
})

// 新規登録
router.post('/register', async (req, res) => {
  console.log('req', req.body)
  const params = req.body
  const name = params.name
  const email = params.email
  let password = params.password
  if ((name === '' || email === '' || password === '') === true) {
    return res.render('auth/register', {
      error: '未入力の欄があります',
      name,
      email
    })
  } else {
    try {
      console.log('sequelize')
      let password = await bcrypt.hash(params.password, 10)
      const [user, created] = await User.findOrCreate({
        where: { email },
        defaults: {
          name,
          type: 2,
          email,
          password
        }
      })
      console.log('user', user, created)
      if (created) {
        res.redirect('/auth/login')
      } else {
        return res.render('auth/register', {
          error: '既に同じメールアドレスのユーザが存在します。',
          name,
          email
        })
      }
    } catch (err) {
      console.log('error', err)
      return res.status(400).json({
        error: {
          message: err.messages
        }
      })
    }
  }
})

// ログアウト
router.get('/logout', (req, res) => {
  req.session.login = undefined

  res.redirect('/')
})

module.exports = router
