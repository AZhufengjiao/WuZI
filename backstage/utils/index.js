// 使用内置方法，不需要下载 
const crypto = require('crypto')

// 橙装一个加密方法
// 使用crypto模块实现MD5加密功能
// 参数：用户注册的密码 拼接 一个字符串 合并后的字符串
// 返回值：返回一个md5加密的密文
module.exports.cryptoPassword = (password) => {
    return crypto.createHash('md5').update(password).digest('hex');
}