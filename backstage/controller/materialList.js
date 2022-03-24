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
} = require("../model/material");
// 后端校验
const Joi = require("joi");

// 获取总物资列表数据
module.exports.materialList = async (ctx) => {
  let obj = {
    num: ctx.request.query.num,
    page: ctx.request.query.page,
  };
  const res = await materialListQuery(obj);
  let arr = res;
  arr.forEach((item) => {
    // 物品
    if (item.type == 1) {
      item.quantity = item.price;
      item.type = "现金";
    } else {
      item.type = "物品";
    }
  });
  let length = await materialListTotal();
  ctx.body = {
    status: 200,
    results: arr,
    total: length[0].total,
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
  let obj = {
    num: ctx.request.query.num,
    page: ctx.request.query.page,
  };
  const arr = await materialScarcitySql(obj);

  ctx.body = {
    status: 200,
    results: arr,
    message: "稀缺物资列表获取成功",
  };
};

// 根据日期获取数据
module.exports.getMaterialByDate = async (ctx) => {
  // 开始日期，结束日期
  let { startDate, endDate } = ctx.request.query;
  console.log(startDate, endDate);

  let dateMaterial = await findMaterialByDate({ startDate, endDate });
  if (dateMaterial[0]) {
    return (ctx.body = {
      code: 200,
      data: dateMaterial,
    });
  }
};
