// sql语句
const {
    userListTable,
    userListTotal,
    delUserList,
    putState,
    putStateUser,
    usernameLike,
    userDonate,
    userDonateTotal,
    userDonateNameLikes,
    userDonateLikeTotal,
    userDonateNameId,
    userDonateTotalId
} = require('../model/users')

// 后端校验
const Joi = require('joi')

// 获取用户列表数据 
module.exports.userList = async (ctx) => {
    const obj = {
        num: ctx.request.query.num,
        page: ctx.request.query.page
    }
    const result = await userListTable(obj)
    const total = await userListTotal()

    result.forEach((item, index) => {
        result[index].state = Boolean(item.state);
    });

    ctx.body = {
        status: 200,
        results: result,
        total: total,
        message: '用户列表数据获取成功'
    }
}

// 删除单个用户数据
module.exports.delOneUser = async (ctx) => {
    // 获取id
    let id = ctx.request.body.id
    let res = await delUserList(id)
    if (res.affectedRows == 1) {
        ctx.body = {
            status: 200,
            message: '用户删除成功'
        }
    }
}

// 修改数据state
module.exports.upDateState = async (ctx) => {
    // 获取id
    let id = ctx.request.body.id
    let res = await putState(id)
    console.log(res);
    if (res.changedRows == 1) {
        ctx.body = {
            status: 200,
            message: 'state修改成功'
        }
    }
}

// 修改用户数据
module.exports.updateUser = async (ctx) => {
    const {
        username,
        mobile,
        email,
        role,
        id
    } = ctx.request.body

    // 后端校验
    /*定义验证规则*/
    const schema = Joi.object({
        username: Joi.string().min(2).max(20).required().error(new Error('用户名格式不正确')),
        email: Joi.string().email(),
        mobile: Joi.string().pattern(new RegExp(/^1(3\d|4[5-9]|5[0-35-9]|6[2567]|7[0-8]|8\d|9[0-35-9])\d{8}$/)).error(new Error('手机号格式不正确')),
        role: Joi.number().integer().valid(0, 1)
    });

    // async function run() {
    try {
        /*验证*/
        const value = await schema.validateAsync({
            username,
            email,
            mobile,
            role
        });
        console.log(value);
        console.log('验证成功');
    } catch (e) {
        console.log(e.message)
        console.log('验证失败');
        return ctx.body = {
            status: 0,
            message: e.message
        }
    }

    const res = await putStateUser(username, mobile, email, role, id)
    console.log(res);
    if (res.affectedRows == 1) {
        ctx.body = {
            status: 200,
            message: '数据修改成功'
        }
    }
}

// 根据用户名查询数据信息
module.exports.getUserLike = async (ctx) => {
    let {
        username,
        num,
        page
    } = ctx.request.query

    const res = await usernameLike(username, num, page)
    res.forEach((item) => {
        item.state = Boolean(item.state)
    })
    console.log(111, res)
    if (res[0]) {
        ctx.body = {
            code: 200,
            results: res,
            message: '模糊查询数据获取成功'
        }
    } else {
        ctx.body = {
            code: 0,
            message: '数据获取失败'
        }
    }

}




// 捐赠页面
// 获取用户捐赠分页列表
module.exports.getUserDonate = async (ctx) => {
    const {
        page,
        num
    } = ctx.request.query

    const res = await userDonate(page, num)
    const total = await userDonateTotal()
    console.log(total[0].total);

    console.log(res);
    if (res[0]) {
        ctx.body = {
            code: 200,
            results: res,
            total: total[0].total,
            message: '用户捐赠列表获取成功'
        }
    }
}

// 根据用户名模糊查询数据信息  
module.exports.userDonateNameLike = async (ctx) => {
    let {
        username,
        num,
        page
    } = ctx.request.query

    const res = await userDonateNameLikes(username, num, page)
    const total = await userDonateLikeTotal(username)

    res.forEach((item) => {
        item.type = Boolean(item.type)
    })
    console.log(res)
    if (res[0]) {
        ctx.body = {
            code: 200,
            results: res,
            total: total[0].total,
            message: '模糊查询数据获取成功'
        }
    } else {
        ctx.body = {
            code: 0,
            message: '数据获取失败'
        }
    }

}

// 根据用户名查询数据信息  
module.exports.userDonateId = async (ctx) => {
    let {
        id,
        num,
        page
    } = ctx.request.query

    const res = await userDonateNameId(id, num, page)

    const total = await userDonateTotalId(id)

    res.forEach((item) => {
        item.type = Boolean(item.type)
    })
    console.log(res)
    if (res[0]) {
        ctx.body = {
            code: 200,
            results: res,
            total: total[0].total,
            message: '模糊查询数据获取成功'
        }
    } else {
        ctx.body = {
            code: 0,
            message: '数据获取失败'
        }
    }

}