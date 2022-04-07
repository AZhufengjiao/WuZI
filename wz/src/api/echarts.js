import {requestWithoutToken, requestWithToken} from '../utils/request'

// 物资情况
export  function  getExistingMaterial( ){
    return requestWithToken('/material/getExistingMaterial','get')
}
