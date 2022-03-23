import {requestWithoutToken} from "../utils/request";

// 获取分页显示用户列表
export  function userList({num,page}){
    return requestWithoutToken('/users/userList','get', {num,page})
}

// 删除单个用户
export function DelUser(id){
    return requestWithoutToken('/users/delUser','delete',{id})
}

// 修改用户state属性
export  function  updateState(id){
    return requestWithoutToken('/users/updateState','put',{id})
}

// 修改用户数据
export  function upDataUser({username, mobile, email, role, id}){
    return requestWithoutToken('/users/updateUser','put',{username, mobile, email, role, id})
}

//模糊查询用户名
export  function getUsernameLike ({username,num,page}){
    return requestWithoutToken('/users/getUserLike','get', {username,num,page})
}




// 获取用户捐赠列表数据
export  function getUserDonate({page,num}){
    return requestWithoutToken('/users/getUserDonate','get',{page,num})
}

// 获取模糊查询数据
export  function getUserDonateLike({username,page,num}){
    return requestWithoutToken('/users/getUserDonateLike','get',{username,page,num})
}

// 获取用户名及用户id查询数据
export  function getUserDonateUsernameId({id,page,num}){
    return requestWithoutToken('/users/userDonateId','get',{id,page,num})
}
