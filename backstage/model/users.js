// 导入query查询方法
const { query } = require("../database/mysql");

// 用户表格列表
module.exports.userListTable = async ({ page, num }) => {
  return await query(
    `SELECT id,username,mobile,role,email,state  FROM user  ORDER BY  id LIMIT ${
      (page - 1) * num
    },${num}`
  );
};

// 用户列表总数
module.exports.userListTotal = async () => {
  return await query("SELECT COUNT(id) AS total  FROM user");
};

// 删除单个用户
module.exports.delUserList = async (id) => {
  return await query("DELETE FROM user WHERE id=?", [id]);
};

// 修改数据state
module.exports.putState = async (id) => {
  return await query("UPDATE user SET state=NOT state WHERE id=?", [id]);
};

// 修改用户数据
module.exports.putStateUser = async (username, mobile, email, role, id) => {
  return await query(
    "UPDATE user SET username=?,mobile=?,email=?,role=? WHERE id=?",
    [username, mobile, email, role, id]
  );
};

// 模糊查询用户名
module.exports.usernameLike = async (username, num, page) => {
  return await query(
    `SELECT * FROM user WHERE username LIKE '%${username}%' ORDER BY id LIMIT ${
      (page - 1) * num
    },${num}`
  );
};

// 获取用户捐赠列表
/**
 *
 * @param {*} page 页码
 * @param {*} num 容量
 * @returns
 */
module.exports.userDonate = async (page, num) => {
  return await query(
    `SELECT * FROM userdonate ORDER BY did LIMIT ${(page - 1) * num},${num}`
  );
};
// 获取用户捐赠列表总数
module.exports.userDonateTotal = async () => {
  return await query("SELECT COUNT(did) AS total  FROM userdonate");
};
// 模糊查询捐赠用户名
module.exports.userDonateNameLikes = async (username, num, page) => {
  return await query(
    `SELECT * FROM userdonate WHERE username LIKE '%${username}%' ORDER BY did LIMIT ${
      (page - 1) * num
    },${num}`
  );
};
// 获取用户名捐赠模糊查询总数
module.exports.userDonateLikeTotal = async (username) => {
  return await query(
    `SELECT COUNT(did) AS total  FROM userdonate WHERE  username LIKE '%${username}%'`
  );
};
// 查询某用户id历史捐赠
module.exports.userDonateNameId = async (id, num, page) => {
  return await query(
    `SELECT * FROM userdonate WHERE id= ${id}   ORDER BY did LIMIT ${
      (page - 1) * num
    },${num}`
  );
};
// 获取某用户捐赠查询总数
module.exports.userDonateTotalId = async (id) => {
  return await query(
    `SELECT COUNT(did) AS total  FROM userdonate WHERE  id = 12`
  );
};
