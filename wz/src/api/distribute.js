import {requestWithoutToken, requestWithToken} from '../utils/request'

// 获取现有库存数据
/**
 *
 * @param pageNum  当前页码
 * @param pageSize 每页显示多少条数据
 * @returns {AxiosPromise}
 */
export  function  getPutStorageList({pageNum,pageSize}){
    return requestWithToken('/material/getPutStorageList','get',{pageNum,pageSize})
}
// 添加出库数据
export  function  postDelivery(obj){
    return requestWithToken('/material/postDeliveryStorageMaterial','post',obj)
}
// 获取现有库存物资模糊查询
export function  getPutStorageNameList(reqParams){
    return requestWithToken('/material/getExistingMaterialList','get',reqParams)
}
