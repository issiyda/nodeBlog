const express = require('express')
const router = express.Router()
const Blog = require('../models/blog')
const User = require('../models/user')

router.use(express.static('public'))
router.get('/', async (req, res) => {
  const blogs = await Blog.findAll({
    include: [
      {
        model: User
      }
    ],
    where: {
      deletedAt: null
    }
  })
  console.log('blogs', blogs)
  res.render('blog/list', {
    blogs,
    userId: req.session.userInfo ? req.session.userInfo.id : ''
  })
})
router.get('/post', (req, res) => {
  console.log('req', req.session)
  res.render('blog/post')
})

router.post('/post', async (req, res) => {
  const userInfo = req.session.userInfo
  const params = req.body
  const title = params.title
  const contents = params.contents

  if ((title === '' || contents === '') === true) {
    return res.render('blog/post', {
      error: '未入力の欄があります',
      userId: userInfo.id,
      title,
      contents
    })
  } else {
    try {
      const blog = await Blog.create({
        userId: userInfo.id,
        title,
        contents
      })
      if (blog) {
        res.redirect('/blog')
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

router.get('/detail/:blogId', async (req, res) => {
  const blog = await Blog.findOne({
    where: {
      id: req.params.blogId
    }
  })

  console.log('blog', blog)
  console.log('req.session.userInfo.id', req.session)

  res.render('blog/detail', {
    blog,
    userId: req.session.userInfo ? req.session.userInfo.id : ''
  })
})

router.get('/edit/:blogId', async (req, res) => {
  const blog = await Blog.findOne({
    where: {
      id: req.params.blogId
    }
  })
  console.log('blog', blog)
  res.render('blog/edit', { blog })
})

router.post('/edit/:blogId', async (req, res) => {
  console.log('req.params.blogId', req.params.blogId, req.body)
  let blog = await Blog.update(
    {
      title: req.body.title,
      contents: req.body.contents
    },
    {
      where: {
        id: req.params.blogId
      }
    }
  )
  blog = await Blog.findOne({
    where: {
      id: req.params.blogId
    }
  })
  res.render('blog/edit', { blog })
})

router.get('/delete/:blogId', async (req, res) => {
  try {
    const blog = await Blog.findOne({
      where: {
        id: req.params.blogId
      }
    })
    blog.destroy()
    console.log(blog)
    res.redirect('/blog')
  } catch (err) {
    console.log('error', err)
    return res.status(400).json({
      error: {
        message: err.messages
      }
    })
  }
})

module.exports = router
