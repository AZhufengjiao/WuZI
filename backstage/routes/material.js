const router = require("koa-router")();

const {
  materialList,
  materialNameLikeList,
  delmaterials,
  putMaterialsQuantity,
  putMaterialsPrice,
  putMaterialsState,
  delState,
  materialScarcityList,
  getMaterialByDate,
  getPrincipal,
  searchScarceMaterial,
  postMaterialOfStorage, // 稀缺物资
  getPutStorageList,
  getPutStorageByMatertialName,
  updatePutStorageDataById,
  getDeliveryStorageList,
  getExistingMaterialList,
  postDeliveryStorageMaterial,
  getDeliveryStorageListByDate,
  getDeliveryStorageListBySearch,
  getDonationsDataBySixMonths,
  getExistingMaterial,
  getDonationsDataByOneWeek,
} = require("../controller/materialList");

router.prefix("/material");

// 获取总数据分页数据
router.get("/materialList", materialList);
// 根据物资名模糊查询数据信息
router.get("/materialNameLike", materialNameLikeList);
// 删除单个物资
router.delete("/delMaterials", delmaterials);
// 修改单个物资 物品
router.put("/putMaterialsQ", putMaterialsQuantity);
// 修改单个物资 现金
router.put("/putMaterialsP", putMaterialsPrice);
// 修改物资state
router.put("/putMaterialsState", putMaterialsState);
// 删除物资state为1
router.delete("/delState", delState);

// 获取稀缺物资分页数据
router.get("/materialScarcityList", materialScarcityList);
// 根据日期获取物资数据
router.get("/getMaterialByDate", getMaterialByDate);

// 获取负责人
router.get("/getPrincipal", getPrincipal);
// 搜索稀缺物资
router.get("/searchScarceMaterial", searchScarceMaterial);
// 添加入库数据
router.post("/postMaterialOfStorage", postMaterialOfStorage);
// 获取入库数据列表
router.get("/getPutStorageList", getPutStorageList);
// 根据物资名称获取入库数据
router.get("/getPutStorageByMatertialName", getPutStorageByMatertialName);

// 根据id修改物资数据
router.put("/updatePutStorageData", updatePutStorageDataById);

// 出库数据列表
router.get("/getDeliveryStorageList", getDeliveryStorageList);

// 根据日期获取出库数据列表
router.get("/getDeliveryStorageListByDate", getDeliveryStorageListByDate);

// 根据物资名称获取出库数据列表
router.get("/getDeliveryStorageListBySearch", getDeliveryStorageListBySearch);

// 搜索库存物资 --> 专人发放页面
router.get("/getExistingMaterialList", getExistingMaterialList);

// 添加出库数据 --> 专人发放页面
router.post("/postDeliveryStorageMaterial", postDeliveryStorageMaterial);

// 获取六个月内的捐赠情况
router.get("/getDonationsData", getDonationsDataBySixMonths);

// 获取现有物资情况
router.get("/getExistingMaterial", getExistingMaterial);

// 获取一周内的捐赠情况
router.get("/getDonationsDataByOneWeek", getDonationsDataByOneWeek);

module.exports = router;
