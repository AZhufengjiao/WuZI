const router = require('koa-router')()

const {
  userRegister,
  login
} = require('../controller/userLogin')

// 注册
router.post('/register', userRegister)

// 登录
router.post('/login',login)


// router.get('/', userList)

router.get('/string', async (ctx, next) => {
  ctx.body = 'koa2 string'
})

router.get('/json', async (ctx, next) => {
  ctx.body = {
    title: 'koa2 json'
  }
})

module.exports = router