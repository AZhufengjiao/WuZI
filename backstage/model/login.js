// 导入query查询方法
const {
    query
} = require('../database/mysql')

// 注册用户
module.exports.register = async (username, password, mobile, email, role, state) => {
    return await query(`INSERT INTO user(username,PASSWORD,mobile,email,role, state) 
    VALUES('${username}','${password}','${mobile}','${email}',${role},${state})`)
}

// 用户查询 根据用户名查询
module.exports.findUserByUserName = async (username) => {
    return await query(`SELECT * FROM user WHERE username=?`, [username])
}

// 用户登录
module.exports.userLogin = async (username, password) => {
    return await query(`SELECT * FROM user WHERE username=? AND PASSWORD=?`, [username, password])
}
