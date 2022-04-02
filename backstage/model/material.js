// 导入query查询方法
const { query } = require("../database/mysql");

// 总物资列表
module.exports.materialListQuery = async ({ page, num }) => {
  return await query(
    `SELECT * FROM totalmaterial LIMIT ${(page - 1) * num},${num}`
  );
};

// 查询总物资总数
module.exports.materialListTotal = async () => {
  return await query(
    `SELECT COUNT(materialname) AS total  FROM totalmaterial GROUP BY materialname;`
  );
};

// 在总物资查找有没有当前传来的物资
module.exports.findTotalMaterialName = async ({ putMaterialName }) => {
  let sql = `select * from totalmaterial where materialname = '${putMaterialName}'`;
  return query(sql);
};

// 根据物资名修改总物资中物资的数量
module.exports.updateMaterialsAmount = async ({
  putMaterialName,
  quantity = 0,
  price = 0,
}) => {
  let sql = `update totalmaterial set quantity = quantity + ${quantity}, price = price + ${price}, frequency = frequency + 1  where materialname = '${putMaterialName}'`;
  return query(sql);
};

// 向总物资添加数据
module.exports.postToTotalMaterialSql = async ({
  putMaterialName,
  quantity = 0,
  price = 0,
}) => {
  let sql = `INSERT INTO totalmaterial(materialname, quantity, price, frequency) VALUES('${putMaterialName}', ${quantity}, ${price}, 1)`;
  return query(sql);
};

// 模糊查询物资名
module.exports.materialNameLike = async ({ materialName, num, page }) => {
  return await query(
    `SELECT * FROM putstorage ps WHERE materialname LIKE '%${materialName}%' ORDER BY tid LIMIT ${
      (page - 1) * num
    },${num}`
  );
};
// 获取物资模糊查询总数
module.exports.materialNameLikeTotal = async (materialname) => {
  return await query(
    `SELECT COUNT(tid) AS total  FROM putstorage WHERE  materialname LIKE '%${materialname}%'`
  );
};
// 删除单个物资
module.exports.delUserList = async (tid) => {
  return await query("DELETE FROM putstorage WHERE tid=?", [tid]);
};
// 修改单个物资  物品
module.exports.updateMaterialsQuantity = async ({
  materialName,
  quantity,
  type,
  username,
  tid,
}) => {
  return await query(
    `UPDATE putstorage SET materialname='${materialName}',quantity=${quantity},TYPE=${type},username='${username}' WHERE tid=${tid}`
  );
};
// 修改单个物资 现金
module.exports.updateMaterialsPrice = async ({
  materialName,
  price,
  type,
  username,
  tid,
}) => {
  return await query(
    `UPDATE putstorage SET materialname='${materialName}',price=${price},TYPE=${type},username='${username}' WHERE tid=${tid}`
  );
};
// 修改用户，查询捐赠人是否存在
module.exports.userdonateIs = async (username) => {
  return await query(`SELECT * FROM userdonate WHERE  username='${username}'`);
};
// 修改框遗留bug 修改
module.exports.isType = async () => {
  return await query(`UPDATE putstorage SET quantity=0 WHERE TYPE=1`);
};
module.exports.noType = async () => {
  return await query(`UPDATE putstorage SET price=0 WHERE TYPE=0`);
};
// 选中物资修改物资状态
module.exports.selectMaterials = async (tid) => {
  return await query(`UPDATE putstorage SET state=NOT state WHERE tid=${tid}`);
};
// 删除物资state为1
module.exports.DelState = async () => {
  return await query(`DELETE FROM putstorage WHERE state=1`);
};

// 获取稀缺物资数据
module.exports.materialScarcitySql = async ({ num, page }) => {
  return await query(
    `SELECT materialname, quantity, price FROM totalmaterial LIMIT ${
      (page - 1) * num
    }, ${num};`
  );
};

// 获取稀缺物资数据总数量
module.exports.materialScarcityCountSql = async () => {
  return await query(`SELECT materialname, quantity, price FROM totalmaterial`);
};

// 根据日期获取入库数据
module.exports.findMaterialByDate = async ({
  startDate,
  endDate,
  pageNum,
  pageSize,
}) => {
  let sql = `select ps.*, p.principalName from putstorage ps,principal p where p.pid = ps.pid and putDate >= '${startDate}' and putDate <= '${endDate}' and status = 0 order by putDate DESC limit ${
    (pageNum - 1) * pageSize
  }, ${pageSize};`;
  return await query(sql);
};

// 根据日期获取库存数据的总数量
module.exports.findMaterialByDateCount = async ({ startDate, endDate }) => {
  let sql = `select count(*) as total from putstorage where putDate >= '${startDate}' and putDate <= '${endDate}' and status = 0;`;
  return await query(sql);
};

// 获取负责人数据列表
module.exports.findPrincipal = async () => {
  let sql = `select pid as id, principalName as principal from principal;`;
  return query(sql);
};

// 搜索稀缺物资
module.exports.findSearchScarceMaterial = async ({
  materialName,
  pageNum,
  pageSize,
}) => {
  let sql = `SELECT materialname, quantity, price from totalmaterial WHERE materialname LIKE '%${materialName}%' limit ${
    (pageNum - 1) * pageSize
  }, ${pageSize};`;
  return query(sql);
};
// 搜索稀缺物资总数
module.exports.findSearchScarceMaterialCount = async ({ materialName }) => {
  let sql = `SELECT materialname, quantity, price from totalmaterial WHERE materialname LIKE '%${materialName}%'`;
  return query(sql);
};

// 添加入库数据
module.exports.postMaterialOfStorage = async ({
  username,
  putStorageDate,
  putMaterialType,
  putMaterialName,
  pid,
  putMaterialAmount = 0,
  putPriceAmount = 0,
}) => {
  let sql = `INSERT INTO putstorage(username, putDate, type, materialname, pid, quantity, price) VALUES('${username}', '${putStorageDate}', ${putMaterialType}, '${putMaterialName}', ${pid}, ${putMaterialAmount}, ${putPriceAmount})`;
  return query(sql);
};

// 获取入库数据列表
module.exports.findPutStorageList = async ({ pageNum, pageSize }) => {
  let sql = `select ps.*, p.principalName from putstorage ps,principal p where ps.pid = p.pid and status = 0 order by putDate DESC limit ${
    (pageNum - 1) * pageSize
  }, ${pageSize};`;
  return query(sql);
};

// 获取入库数据总数
module.exports.findPutStorageCount = async () => {
  let sql = `select count(*) as total from putstorage where status = 0;`;
  return query(sql);
};

// 根据物资名称查询入库数据
module.exports.findPutStorageByMatertialName = async ({
  materialName,
  pageNum,
  pageSize,
}) => {
  let sql = `select ps.*, p.principalName from putstorage ps,principal p where p.pid = ps.pid and materialname like '%${materialName}%' and status = 0 order by putDate DESC limit ${
    (pageNum - 1) * pageSize
  }, ${pageSize};`;

  return query(sql);
};

// 根据物资名称查询入库数据总数量
module.exports.findPutStorageByMatertialNameCount = async ({
  materialName,
}) => {
  let sql = `select count(*) as total from putstorage where materialname like '%${materialName}%' and status = 0`;

  return query(sql);
};

// 修改入库数据
module.exports.updatePutStorageData = async ({
  id,
  materialName,
  username,
  amount,
  pid,
  materialType,
}) => {
  let sql = `UPDATE putstorage SET materialname = '${materialName}', username = '${username}', price = ${amount}, pid = ${pid}, type = ${materialType} WHERE tid = ${id};`;
  return query(sql);
};

// 获取出库数据列表
module.exports.findDeliveryStorageList = async ({ pageNum, pageSize }) => {
  let sql = `select pm.*, p.principalName from providematerial pm, principal p where pm.pid = p.pid ORDER BY provideDate DESC limit ${
    (pageNum - 1) * pageSize
  }, ${pageSize};`;
  return query(sql);
};

// 获取出库数据列表长度
module.exports.findDeliveryStorageCount = async () => {
  let sql = `select count(*) as total from providematerial;`;
  return query(sql);
};

// 根据日期获取出库数据列表
module.exports.findDeliveryStorageByDateList = async ({
  startDate,
  endDate,
  pageNum,
  pageSize,
}) => {
  let sql = `select pm.*, p.principalName from providematerial pm,principal p where p.pid = pm.pid and provideDate >= '${startDate}' and provideDate <= '${endDate}' order by provideDate DESC limit ${
    (pageNum - 1) * pageSize
  }, ${pageSize};`;
  return query(sql);
};

// 根据日期获取出库数据列表长度
module.exports.findDeliveryStorageByDateCount = async ({
  startDate,
  endDate,
}) => {
  let sql = `select count(*) total from providematerial where provideDate >= '${startDate}' and provideDate <= '${endDate}'  order by provideDate DESC;`;
  return query(sql);
};

// 根据物资名称查询出库数据
module.exports.findDeliveryStorageByMatertialName = async ({
  materialName,
  pageNum,
  pageSize,
}) => {
  let sql = `select pm.*, p.principalName from providematerial pm,principal p where p.pid = pm.pid and provideMaterialName like '%${materialName}%' order by provideDate DESC limit ${
    (pageNum - 1) * pageSize
  }, ${pageSize};`;

  return query(sql);
};

// 根据物资名称查询出库数据总数量
module.exports.findDeliveryStorageByMatertialNameCount = async ({
  materialName,
}) => {
  let sql = `select count(*) as total from providematerial where provideMaterialName like '%${materialName}%'`;
  return query(sql);
};

// 搜索存库物资 --专人发放页面
module.exports.findExistingMaterialList = async ({
  materialName,
  pageNum,
  pageSize,
}) => {
  let sql = `select materialname, SUM(price) as priceAmount, SUM(quantity) quantityAmount FROM putstorage WHERE materialname LIKE '%${materialName}%' AND status = 0 GROUP BY materialname LIMIT ${
    (pageNum - 1) * pageSize
  }, ${pageSize};`;
  return query(sql);
};

// 搜索存库物资数据总数量 --专人发放页面
module.exports.findExistingMaterialCount = async ({ materialName }) => {
  let sql = `select materialname FROM putstorage WHERE materialname LIKE '%${materialName}%' AND status = 0 GROUP BY materialname;`;
  return query(sql);
};

// 专人发放页面点击出库后，修改总仓库数据的状态，在把数据添加到出库表中
module.exports.postDeliveryStorageMaterial = async ({
  pid,
  materialName,
  address,
  amount,
  recipientName,
  recipientMobile,
  deliveryDate,
}) => {
  let sql = `INSERT INTO providematerial(pid, provideMaterialName, provideMaterialCity, provideMaterialAmount, recipientName, recipientMobile, provideDate) VALUES(${pid}, '${materialName}', '${address}', ${amount}, '${recipientName}', '${recipientMobile}', '${deliveryDate}')`;
  return query(sql);
};

// 根据物资id修改物资为出库状态
module.exports.updateMaterialStatus = async ({ id }) => {
  let sql = `update putstorage set status = 1 where tid = ${id};`;
  return query(sql);
};

// 修改入库数据的时候，需要重新计算总物资中的物资总数量
module.exports.updateTotalMaterialAmount = async ({
  materialName,
  quantity = 0,
  price = 0,
}) => {
  let sql = `update totalmaterial set quantity = ${quantity}, price = ${price} where materialname = '${materialName}'`;
  return query(sql);
};

module.exports.findTotalMaterialQuantityByName = async ({ materialName }) => {
  let sql = `select sum(quantity) quantity from putstorage where materialname = '${materialName}'`;
  return query(sql);
};

module.exports.findTotalMaterialPriceByName = async ({ materialName }) => {
  let sql = `select sum(price) price from putstorage where materialname = '${materialName}'`;
  return query(sql);
};
