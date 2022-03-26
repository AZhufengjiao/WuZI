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

router.get("/getMaterialByDate", getMaterialByDate);

router.get("/getPrincipal", getPrincipal);

router.get("/searchScarceMaterial", searchScarceMaterial);

router.post("/postMaterialOfStorage", postMaterialOfStorage);

router.get("/getPutStorageList", getPutStorageList);

module.exports = router;
