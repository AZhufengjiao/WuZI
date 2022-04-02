import {requestWithoutToken} from "../utils/request";

// 获取总物资列表
export  function materialsList({num,page}){
    return requestWithoutToken('/material/materialList','get', {num,page})
}
// 获取物资名模糊查询
export  function materialsNameList({ materialName,   page,   num}){
    return requestWithoutToken('/material/materialNameLike','get', {materialName,num,page})
}
// 删除单个物资
export function  delMaterials(tid){
    return requestWithoutToken('/material/delMaterials','delete',{tid})
}
// 修改物资 物品
export function  updateMaterials({ tid,materialName,username,quantity,type}){
    return requestWithoutToken('/material/putMaterialsQ','put',{ tid,materialName,username,quantity,type})
}
// 修改物资 现金
export function  updateMaterialsP({ tid,materialName,username,price,type}){
    return requestWithoutToken('/material/putMaterialsP','put',{ tid,materialName,username,price,type})
}
// 修改物资state
export function  putMaterialsState(tid){
    return requestWithoutToken('/material/putMaterialsState','put',{tid})
}
// 删除物资为1
export  function  DelMaterialsState(){
    return requestWithoutToken('/material/delState','delete')
}
// 总物资时间查找
export function getDateMaterials({startDate, endDate,pageNum,pageSize}){
    return requestWithoutToken('/material/getMaterialByDate','get',{startDate,endDate,pageNum,pageSize})
}


// 稀缺物资数据
export  function  materialScarcityList({num,page}){
    return requestWithoutToken('/material/materialScarcityList','get',{num,page})
}
// 获取负责人
export  function  materialPrincipal(){
    return requestWithoutToken('/material/getPrincipal','get')
}
// 稀缺物资模糊查询
export function materialScarcityLikeName({materialName,pageNum,pageSize}){
    return requestWithoutToken('/material/searchScarceMaterial','get',{materialName,pageNum,pageSize})
}


// 入库物资总数据获取
export  function materialStorageList({pageNum,pageSize}){
return requestWithoutToken('/material/getPutStorageList','get',{pageNum,pageSize})
}
// 入库 添加数据
export  function addMaterialStorage(obj){
    return requestWithoutToken('/material/postMaterialOfStorage','post',obj)
}
// 根据物资名模糊查询入库数据
export  function  searchMaterialName(obj){
    return requestWithoutToken('/material/getPutStorageByMatertialName','get',obj)
}
// 根据入库物资id修改入库数据
export  function  updateMaterialList(obj){
    return requestWithoutToken('/material/updatePutStorageData','put',obj)
}


// 获取出库数据
export  function  getChuKu({pageNum,pageSize}){
    return requestWithoutToken('/material/getDeliveryStorageList','get',{pageNum,pageSize})
}
// 根据时间获取出库数据
export function dateChuKu(obj){
    return requestWithoutToken('/material/getDeliveryStorageListByDate','get',obj)
}
// 根据物资名模糊查询获取出库物资
export  function  getChuKuList(obj){
    return requestWithoutToken('/material/getDeliveryStorageListBySearch','get',obj)
}
