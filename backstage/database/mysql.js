// 导入mysql模块
var mysql = require("mysql");

// 驱动内置的连接池
var pool = mysql.createPool({
  // 创建一个具有五个连接的连接池
  connectionLimit: 5,
  host: "localhost",
  user: "root",
  password: "123456aa",
  database: "wuzidb",
});

module.exports.query = (sql, value) => {
  return new Promise((resolve, reject) => {
    pool.getConnection(function (err, connection) {
      if (err) {
        console.log(err);
      } // not connected!

      // Use the connection
      connection.query(sql, value, function (error, results, fields) {
        // When done with the connection, release it.
        connection.release();

        // Handle error after the release.
        if (error) throw error;
        resolve(results);
        // Don't use the connection here, it has been returned to the pool.
      });
    });
  });
};
