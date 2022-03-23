import {requestWithoutToken, requestWithToken} from '../utils/request'

/**
 * 用户登录
 * @param username 用户名
 * @param password 密码
 * @returns {*}
 */
export  function  userLogin(username,password){
    console.log(username,password)
    return requestWithToken('/login','post',{username,password})
}

/**
 * 注册用户
 * @param username
 * @param password
 * @param mobile
 * @param email
 * @param role
 * @returns {AxiosPromise}
 */
export  function userRegister(username, password, mobile, email, role,state){
    return requestWithoutToken('/register','post',{username, password, mobile, email, role,state})
}

