// sql语句
const {
  materialListQuery,
  materialListTotal,
  materialNameLike,
  materialNameLikeTotal,
  delUserList,
  updateMaterialsPrice,
  userdonateIs,
  updateMaterialsQuantity,
  isType,
  noType,
  selectMaterials,
  DelState,
  materialScarcitySql, // 获取稀缺物资数据
  findMaterialByDate,
  findMaterialByDateCount,
  findPrincipal,
  findSearchScarceMaterial,
  materialScarcityCountSql,
  findSearchScarceMaterialCount,
  postMaterialOfStorage,
  findPutStorageList,
  findPutStorageCount,
} = require("../model/material");
// 后端校验
const Joi = require("joi");

// 引入修改日期库
const moment = require("moment");

// 定义修改日期的函数
function updateDate(date) {
  return moment(date).format("YYYY-MM-DD  h:mm");
}

// 获取总物资列表数据
module.exports.materialList = async (ctx) => {
  let obj = {
    num: ctx.request.query.num,
    page: ctx.request.query.page,
  };
  const res = await materialListQuery(obj);
  let arr = res;
  arr.forEach((item) => {
    item.date = updateDate(item.date);
    // 物品
    if (item.materialname == "现金") {
      item.type = "现金";
    } else {
      item.type = "物品";
    }
  });
  let total = await materialListTotal();
  ctx.body = {
    status: 200,
    results: arr,
    total: total.length,
    message: "总物资列表获取成功",
  };
};
// 获取物资名模糊查询
module.exports.materialNameLikeList = async (ctx) => {
  let { materialName, page, num } = ctx.request.query;
  let res = await materialNameLike({
    materialName,
    page,
    num,
  });
  let arr = res;
  arr.forEach((item) => {
    // 物品
    if (item.type == 1) {
      item.type = "现金";
      item.quantity = item.price;
    } else {
      item.type = "物品";
    }
  });
  let length = await materialNameLikeTotal(materialName);
  if (res[0]) {
    return (ctx.body = {
      status: 200,
      results: arr,
      total: length[0].total,
      message: "物资名模糊查询获取成功",
    });
  } else {
    return (ctx.body = {
      status: 0,
      message: "物资名模糊查询获取失败",
    });
  }
};
// 删除单个物资
module.exports.delmaterials = async (ctx) => {
  let tid = ctx.request.body.tid;
  let res = await delUserList(tid);
  if (res.affectedRows == 1) {
    ctx.body = {
      status: 200,
      message: "该物资删除成功",
    };
  }
};
// 修改某个物资 物品
module.exports.putMaterialsQuantity = async (ctx) => {
  let { materialName, quantity, type, username, tid } = ctx.request.body;
  // 后端校验
  /*定义验证规则*/
  const schema = Joi.object({
    materialName: Joi.string()
      .min(1)
      .max(20)
      .required()
      .error(new Error("物资名格式不正确")),
    quantity: Joi.number()
      .integer()
      .min(1)
      .required()
      .error(new Error("物资名格式不正确")),
    type: Joi.number().integer().valid(0, 1),
    username: Joi.string()
      .min(1)
      .max(20)
      .required()
      .error(new Error("用户名格式不正确")),
  });

  // async function run() {
  try {
    /*验证*/
    const value = await schema.validateAsync({
      materialName,
      quantity,
      type,
      username,
    });
    console.log(value);
    console.log("验证成功");
  } catch (e) {
    console.log(e.message);
    console.log("验证失败");
    return (ctx.body = {
      status: 0,
      message: e.message,
    });
  }

  // 判断修改捐赠人是否存在
  const isUserdonate = await userdonateIs(username);
  // 不存在
  if (!isUserdonate[0]) {
    return (ctx.body = {
      status: 0,
      message: "该捐赠人不存在",
    });
  }

  // 修改 类型为物品
  const res = await updateMaterialsQuantity({
    materialName,
    quantity,
    type,
    username,
    tid,
  });
  if (res.affectedRows == 1) {
    ctx.body = {
      status: 200,
      message: "物资修改成功",
    };
  }

  await noType();
};
// 修改某个物资 现金
module.exports.putMaterialsPrice = async (ctx) => {
  let { materialName, price, type, username, tid } = ctx.request.body;
  // 后端校验
  /*定义验证规则*/
  const schema = Joi.object({
    materialName: Joi.string()
      .min(1)
      .max(20)
      .required()
      .error(new Error("物资名格式不正确")),
    price: Joi.number()
      .integer()
      .min(1)
      .required()
      .error(new Error("物资名格式不正确")),
    type: Joi.number().integer().valid(0, 1),
    username: Joi.string()
      .min(1)
      .max(20)
      .required()
      .error(new Error("用户名格式不正确")),
  });

  // async function run() {
  try {
    /*验证*/
    const value = await schema.validateAsync({
      materialName,
      price,
      type,
      username,
    });
    console.log(value);
    console.log("验证成功");
  } catch (e) {
    console.log(e.message);
    console.log("验证失败");
    return (ctx.body = {
      status: 0,
      message: e.message,
    });
  }

  // 判断修改捐赠人是否存在
  const isUserdonate = await userdonateIs(username);
  // 不存在
  if (!isUserdonate[0]) {
    return (ctx.body = {
      status: 0,
      message: "该捐赠人不存在",
    });
  }

  // 修改 类型为物品
  const res = await updateMaterialsPrice({
    materialName,
    price,
    type,
    username,
    tid,
  });
  if (res.affectedRows == 1) {
    ctx.body = {
      status: 200,
      message: "物资修改成功",
    };
  }
  await isType();
};
// 修改物资state
module.exports.putMaterialsState = async (ctx) => {
  let tid = ctx.request.body.tid;
  console.log(tid);
  let res = await selectMaterials(tid);
  if (res.affectedRows == 1) {
    ctx.body = {
      status: 200,
      message: "修改成功",
    };
  }
};
// 删除物资state为1
module.exports.delState = async (ctx) => {
  let res = await DelState();
  console.log(res);
  if (res.affectedRows != 0) {
    ctx.body = {
      status: 200,
      message: "删除成功",
    };
  } else {
    return (ctx.body = {
      status: 0,
      message: "删除失败",
    });
  }
};

// 获取稀缺物资数据
module.exports.materialScarcityList = async (ctx) => {
  let { num, page } = ctx.request.query;
  const arr = await materialScarcitySql({ num, page });
  const total = await materialScarcityCountSql();

  ctx.body = {
    status: 200,
    data: {
      items: arr,
      total: total[0].total,
      num: Number(num),
      page: Number(page),
    },
    message: "稀缺物资列表获取成功",
  };
};

// 根据日期获取数据
module.exports.getMaterialByDate = async (ctx) => {
  //    开始日期， 结束日期，  当前页， 每页多少条
  let { startDate, endDate, pageNum, pageSize } = ctx.request.query;

  // 从数据库中根据日期查找数据
  let dateMaterial = await findMaterialByDate({
    startDate,
    endDate,
    pageNum,
    pageSize,
  });

  // 使用moment修改所有数据的日期格式
  dateMaterial.forEach((item) => {
    item.date = updateDate(item.date);

    // 物品
    if (item.type == 1) {
      item.quantity = item.price;
      item.type = "现金";
    } else {
      item.type = "物品";
    }
  });

  // 获取数据总数量
  let materialByDateCount = await findMaterialByDateCount({
    startDate,
    endDate,
  });

  return (ctx.body = {
    code: 200,
    message: "数据获取成功",
    data: {
      items: dateMaterial,
      total: materialByDateCount[0].total,
      pageNum: Number(pageNum),
      pageSize: Number(pageSize),
    },
  });
};

// 获取负责人列表
module.exports.getPrincipal = async (ctx) => {
  let principal = await findPrincipal();

  if (principal[0]) {
    return (ctx.body = {
      code: 200,
      message: "负责人数据获取成功",
      data: {
        principal,
      },
    });
  }

  return (ctx.body = {
    code: 500,
    message: "负责人数据获取失败",
  });
};

// 搜索稀缺物资
module.exports.searchScarceMaterial = async (ctx) => {
  let { materialName, pageNum, pageSize } = ctx.request.query;
  let searchScarceMaterial = await findSearchScarceMaterial({
    materialName,
    pageNum,
    pageSize,
  });

  console.log(materialName);

  let total = await findSearchScarceMaterialCount({ materialName });

  return (ctx.body = {
    code: 200,
    message: "稀缺物资模糊查询数据获取成功",
    data: {
      searchScarceMaterial,
      total: total[0].total,
    },
  });
};

// 获取入库数据

// 添加物资入库
module.exports.postMaterialOfStorage = async (ctx) => {
  let {
    id,
    putStorageDate,
    putMaterialType,
    putMaterialName,
    pid,
    putMaterialAmount,
    putPriceAmount,
  } = ctx.request.body;

  let addMaterial;

  if (putMaterialType === 1) {
    addMaterial = await postMaterialOfStorage({
      id,
      putStorageDate,
      putMaterialType,
      putMaterialName,
      pid,
      putPriceAmount,
    });
  } else {
    addMaterial = await postMaterialOfStorage({
      id,
      putStorageDate,
      putMaterialType,
      putMaterialName,
      pid,
      putMaterialAmount,
    });
  }

  return (ctx.body = {
    code: 200,
    message: "入库成功",
  });
};

module.exports.getPutStorageList = async (ctx) => {
  let { pageNum, pageSize } = ctx.request.query;

  let putStorageList = await findPutStorageList({ pageNum, pageSize });

  let total = await findPutStorageCount();

  return (ctx.body = {
    code: 200,
    message: "入库物资数据获取成功",
    data: {
      items: putStorageList,
      total: total[0].total,
      pageNum,
      pageSize,
    },
  });
};
