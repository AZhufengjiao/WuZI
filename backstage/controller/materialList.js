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
  findPutStorageByMatertialName,
  findPutStorageByMatertialNameCount,
  updatePutStorageData,
  findDeliveryStorageList,
  findDeliveryStorageCount,
  findExistingMaterialList,
  findExistingMaterialCount,
  postDeliveryStorageMaterial,
  updateMaterialStatus,
  findDeliveryStorageByDateList,
  findDeliveryStorageByDateCount,
  findDeliveryStorageByMatertialNameCount,
  findDeliveryStorageByMatertialName,
  postToTotalMaterialSql,
  findTotalMaterialName,
  updateMaterialsAmount,
  updateTotalMaterialAmount,
  findTotalMaterialByName,
  findTotalMaterialQuantityByName,
  findTotalMaterialPriceByName,
  deleteDeliveryStorageMaterials,
  getDonationsData,
  getExistingMaterial,
  getDonationsDataByOneWeek,
  checkUserName,
  postUserDonate,
  getDonationsDataBySixMonths,
  findDonationsDataByOneWeek,
} = require("../model/material");
// 后端校验
const Joi = require("joi");

// 引入修改日期库
const moment = require("moment");
const { findUserByUserName } = require("../model/login");

// 定义修改日期的函数
function updateDate(date) {
  return moment(date).format("YYYY-MM-DD  h:mm");
}

// 向总物资中添加一条数据
async function postToTotalMaterial({ putMaterialName, amount }) {
  // 添加之前先去查找，总物资中有没有这个物资，如果没有，再添加，如果有，就累计物资数量
  let materialResult = await findTotalMaterialName({ putMaterialName });
  if (materialResult[0]) {
    // 如果数据库中有这个物资，那就增加这个物资的数量
    if (putMaterialName === "现金") {
      await updateMaterialsAmount({ putMaterialName, price: amount });
    } else {
      await updateMaterialsAmount({ putMaterialName, quantity: amount });
    }
  } else {
    // 如果没有这个物资，就新增这个物资
    if (putMaterialName === "现金") {
      await postToTotalMaterialSql({ putMaterialName, price: amount });
    } else {
      await postToTotalMaterialSql({ putMaterialName, quantity: amount });
    }
  }
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
    item.putDate = updateDate(item.putDate);
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
  } catch (e) {
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
  } catch (e) {
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

// 获取稀缺物资数据
module.exports.materialScarcityList = async (ctx) => {
  let { num, page } = ctx.request.query;
  let arr = await materialScarcitySql({ num, page });

  arr = arr.filter(
    (item) =>
      (item.quantity > 0 && item.quantity < 1000) ||
      (item.price > 0 && item.price < 1000)
  );
  let total = await materialScarcityCountSql();

  total = total.filter(
    (item) =>
      (item.quantity > 0 && item.quantity < 1000) ||
      (item.price > 0 && item.price < 1000)
  );

  ctx.body = {
    status: 200,
    data: {
      items: arr,
      total: total.length,
      num: Number(num),
      page: Number(page),
    },
    message: "稀缺物资列表获取成功",
  };
};

// 搜索稀缺物资
module.exports.searchScarceMaterial = async (ctx) => {
  let { materialName, pageNum, pageSize } = ctx.request.query;
  let searchScarceMaterial = await findSearchScarceMaterial({
    materialName,
    pageNum,
    pageSize,
  });
  searchScarceMaterial = searchScarceMaterial.filter(
    (item) =>
      (item.quantity > 0 && item.quantity < 1000) ||
      (item.price > 0 && item.price < 1000)
  );

  let total = await findSearchScarceMaterialCount({ materialName });

  total = total.filter(
    (item) =>
      (item.quantity > 0 && item.quantity < 1000) ||
      (item.price > 0 && item.price < 1000)
  );

  return (ctx.body = {
    code: 200,
    message: "稀缺物资模糊查询数据获取成功",
    data: {
      searchScarceMaterial,
      total: total.length,
    },
  });
};

// 获取入库数据
// 添加物资入库
module.exports.postMaterialOfStorage = async (ctx) => {
  let {
    username,
    putStorageDate,
    putMaterialType,
    putMaterialName,
    pid,
    amount,
  } = ctx.request.body;

  let checkResult = await checkUserName({ username });
  console.log(checkResult);

  if (!checkResult[0]) {
    return (ctx.body = {
      code: 0,
      message: "用户不存在",
    });
  }

  await postToTotalMaterial({ putMaterialName, amount });

  let addMaterial;

  if (putMaterialType === 1) {
    addMaterial = await postMaterialOfStorage({
      username,
      putStorageDate,
      putMaterialType,
      putMaterialName,
      pid,
      putPriceAmount: amount,
    });

    await postUserDonate({
      id: checkResult[0].id,
      username,
      type: putMaterialType,
      materialName: putMaterialName,
      price: amount,
      date: putStorageDate,
    });
  } else {
    addMaterial = await postMaterialOfStorage({
      username,
      putStorageDate,
      putMaterialType,
      putMaterialName,
      pid,
      putMaterialAmount: amount,
    });

    await postUserDonate({
      id: checkResult[0].id,
      username,
      type: putMaterialType,
      materialName: putMaterialName,
      quantity: amount,
      date: putStorageDate,
    });
  }

  return (ctx.body = {
    code: 200,
    message: "入库成功",
  });
};

// 获取入库数据列表
module.exports.getPutStorageList = async (ctx) => {
  let { pageNum, pageSize } = ctx.request.query;

  let putStorageList = await findPutStorageList({ pageNum, pageSize });

  putStorageList.forEach((item) => {
    item.putDate = updateDate(item.putDate);
  });

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

// 根据日期获取入库数据
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
    item.putDate = updateDate(item.putDate);

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

// 根据物资名称搜索入库数据
module.exports.getPutStorageByMatertialName = async (ctx) => {
  let { materialName, pageNum, pageSize } = ctx.request.query;

  let putStorageByMatertialNameList = await findPutStorageByMatertialName({
    materialName,
    pageNum,
    pageSize,
  });

  putStorageByMatertialNameList.forEach((item) => {
    item.putDate = updateDate(item.putDate);
  });

  let total = await findPutStorageByMatertialNameCount({ materialName });

  return (ctx.body = {
    code: 200,
    message: "入库数据模糊查询成功",
    data: {
      items: putStorageByMatertialNameList,
      total: total[0].total,
      pageNum,
      pageSize,
    },
  });
};

// 根据id修改入库数据
module.exports.updatePutStorageDataById = async (ctx) => {
  let { id, materialName, username, amount, pid, materialType } =
    ctx.request.body;

  await updatePutStorageData({
    id,
    materialName,
    username,
    amount,
    pid,
    materialType,
  });

  if (materialName !== "现金") {
    // 修改完成后，更新总物资的总数量
    let Quantity = await findTotalMaterialQuantityByName({ materialName });
    await updateTotalMaterialAmount({
      materialName,
      quantity: Quantity[0].quantity,
    });
  } else {
    let priceResult = await findTotalMaterialPriceByName({ materialName });
    await updateTotalMaterialAmount({
      materialName,
      price: priceResult[0].price,
    });
  }

  let findUser = await findUserByUserName(username);

  if (!findUser[0]) {
    return (ctx.body = {
      code: 500,
      message: "用户不存在，请确认用户名",
    });
  }

  return (ctx.body = {
    code: 200,
    message: "入库数据修改成功",
  });
};

// 出库
// 获取出库数据列表
module.exports.getDeliveryStorageList = async (ctx) => {
  let { pageNum, pageSize } = ctx.request.query;
  let deliveryStorageList = await findDeliveryStorageList({
    pageNum,
    pageSize,
  });

  let total = await findDeliveryStorageCount();

  return (ctx.body = {
    code: 200,
    message: "出库数据获取成功",
    data: {
      items: deliveryStorageList,
      total: total[0].total,
      pageNum,
      pageSize,
    },
  });
};

// 根据日期获取出库数据列表
module.exports.getDeliveryStorageListByDate = async (ctx) => {
  let { startDate, endDate, pageNum, pageSize } = ctx.request.query;
  let deliveryStorageList = await findDeliveryStorageByDateList({
    startDate,
    endDate,
    pageNum,
    pageSize,
  });

  deliveryStorageList.forEach((item) => {
    item.provideDate = updateDate(item.provideDate);
  });

  let total = await findDeliveryStorageByDateCount({ startDate, endDate });

  return (ctx.body = {
    code: 200,
    message: "根据日期获取出库数据成功",
    data: {
      items: deliveryStorageList,
      total: total[0].total,
      pageNum,
      pageSize,
    },
  });
};

// 搜索出库数据
module.exports.getDeliveryStorageListBySearch = async (ctx) => {
  let { materialName, pageNum, pageSize } = ctx.request.query;
  let searchList = await findDeliveryStorageByMatertialName({
    materialName,
    pageNum,
    pageSize,
  });

  searchList.forEach((item) => {
    item.provideDate = updateDate(item.provideDate);
  });

  let total = await findDeliveryStorageByMatertialNameCount({ materialName });
  return (ctx.body = {
    code: 200,
    message: "根据物资名称搜索出库数据成功",
    data: {
      items: searchList,
      total: total[0].total,
      pageNum,
      pageSize,
    },
  });
};

// 搜索存库物资 --专人发放页面
module.exports.getExistingMaterialList = async (ctx) => {
  let { materialName, pageNum, pageSize } = ctx.request.query;
  let existingMaterialList = await findExistingMaterialList({
    materialName,
    pageNum,
    pageSize,
  });

  existingMaterialList.forEach((item) => {
    item.provideDate = updateDate(item.provideDate);
  });

  let total = await findExistingMaterialCount({ materialName });

  return (ctx.body = {
    code: 200,
    message: "库存物资模糊查询成功",
    data: {
      items: existingMaterialList,
      total: total[0].total,
      pageNum,
      pageSize,
    },
  });
};

// 专人发放页面点击出库后，修改总仓库数据的状态，在把数据添加到出库表中
module.exports.postDeliveryStorageMaterial = async (ctx) => {
  let {
    ids,
    pid,
    materialName,
    address,
    amount,
    recipientName,
    recipientMobile,
    deliveryDate,
  } = ctx.request.body;
  await postDeliveryStorageMaterial({
    pid,
    materialName,
    address,
    amount,
    recipientName,
    recipientMobile,
    deliveryDate,
  });

  await deleteDeliveryStorageMaterials(ids);

  return (ctx.body = {
    code: 200,
    message: "出库操作成功",
  });
};

// 首页捐赠情况eCharts柱状图数据
module.exports.getDonationsData = async (ctx) => {
  let getResult = await getDonationsData();

  return (ctx.body = {
    code: 200,
    message: "捐赠情况数据获取成功",
    data: {
      items: getResult,
    },
  });
};

// 首页六个月以内的捐赠情况eCharts柱状图数据
module.exports.getDonationsDataBySixMonths = async (ctx) => {
  let getResult = await getDonationsDataBySixMonths();

  return (ctx.body = {
    code: 200,
    message: "捐赠情况数据获取成功",
    data: {
      items: getResult,
    },
  });
};

// 获取现有物资情况 -> 首页
module.exports.getExistingMaterial = async (ctx) => {
  let getResult = await getExistingMaterial();
  return (ctx.body = {
    code: 200,
    message: "物资情况数据获取成功",
    data: {
      items: getResult,
    },
  });
};

// 首页一周以内的捐赠情况eCharts线性图数据
module.exports.getDonationsDataByOneWeek = async () => {
  let getResult = await findDonationsDataByOneWeek();
  console.log(getResult);
};
