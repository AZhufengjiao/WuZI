const router = require('koa-router')()

const {
  userList,
  delOneUser,
  upDateState,
  updateUser,
  getUserLike,
  getUserDonate,
  userDonateNameLike,
  userDonateId
} = require('../controller/userList')

router.prefix('/users')

// 获取分页用户信息
router.get('/userList', userList)

// 删除单个用户
router.delete('/delUser', delOneUser)

// 修改用户state属性
router.put('/updateState', upDateState)

// 修改用户数据
router.put('/updateUser', updateUser)

// 根据用户名查询数据信息
router.get('/getUserLike', getUserLike)



// 获取用户捐赠分页数据
router.get('/getUserDonate', getUserDonate)
// 根据用户名模糊查询数据信息
router.get('/getUserDonateLike', userDonateNameLike)
// 根据捐赠用户id查询数据信息
router.get('/userDonateId', userDonateId)

module.exports = router