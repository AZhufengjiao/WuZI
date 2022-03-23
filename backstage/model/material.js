// 导入query查询方法
const {
    query
} = require('../database/mysql')

// 总物资列表
module.exports.materialListQuery = async ({
    page,
    num
}) => {
    return await query(`SELECT  COUNT(1) AS 'count' ,materialname ,type,SUM(quantity) AS quantity, SUM(price)AS price FROM totalmaterial   GROUP BY materialname LIMIT ${(page-1)*num},${num}`)
}
// 查询总物资总数
module.exports.materialListTotal = async () => {
    return await query(`SELECT COUNT(tid) AS total  FROM totalmaterial `)
    // return await query(`SELECT COUNT(tid) AS total  FROM totalmaterial `)
}
// 模糊查询物资名
module.exports.materialNameLike = async ({
    materialName,
    num,
    page
}) => {
    return await query(`SELECT * FROM totalmaterial WHERE materialname LIKE '%${materialName}%' ORDER BY tid LIMIT ${(page-1)*num},${num}`)
}
// 获取物资模糊查询总数  
module.exports.materialNameLikeTotal = async (materialname) => {
    return await query(`SELECT COUNT(tid) AS total  FROM totalmaterial WHERE  materialname LIKE '%${materialname}%'`)
}
// 删除单个物资
module.exports.delUserList = async (tid) => {
    return await query('DELETE FROM totalmaterial WHERE tid=?', [tid])
}
// 修改单个物资  物品
module.exports.updateMaterialsQuantity = async ({
    materialName,
    quantity,
    type,
    username,
    tid
}) => {
    return await query(`UPDATE totalmaterial SET materialname='${materialName}',quantity=${quantity},TYPE=${type},username='${username}' WHERE tid=${tid}`)
}
// 修改单个物资 现金
module.exports.updateMaterialsPrice = async ({
    materialName,
    price,
    type,
    username,
    tid
}) => {
    return await query(`UPDATE totalmaterial SET materialname='${materialName}',price=${price},TYPE=${type},username='${username}' WHERE tid=${tid}`)
}
// 修改用户，查询捐赠人是否存在
module.exports.userdonateIs = async (username) => {
    return await query(`SELECT * FROM userdonate WHERE  username='${username}'`)
}
// 修改框遗留bug 修改
module.exports.isType = async () => {
    return await query(`UPDATE totalmaterial SET quantity=0 WHERE TYPE=1`)
}
module.exports.noType = async () => {
    return await query(`UPDATE totalmaterial SET price=0 WHERE TYPE=0`)
}
// 选中物资修改物资状态
module.exports.selectMaterials = async (tid) => {
    return await query(`UPDATE totalmaterial SET state=NOT state WHERE tid=${tid}`)
}
// 删除物资state为1
module.exports.DelState = async () => {
    return await query(`DELETE FROM totalmaterial WHERE state=1`)
}



// 获取稀缺物资数据
module.exports.materialScarcitySql = async ({
    num,
    page
}) => {
    return await query(`SELECT  * FROM  materialsScarcity  LIMIT ${(page-1)*num},${num}`)
}