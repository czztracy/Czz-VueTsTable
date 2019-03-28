/*
 * @Page: 利率接口方法
 * @Author: cong
 * @Date: 2019-01-09 16:29:37
 * @Last Modified by: cong
 */
import request from '@/utils/request';
import { api } from '@/utils/api';
import { Vue } from "vue-property-decorator";
import { Message } from 'element-ui';
Vue.prototype.$message = Message;
function searchLendingRate(params: any) {
  return request({
    url: api() + 'lendingRate/searchLendingRate',
    method: 'post',
    params
  });
}
function searchLiscountRate(params: any) {
  return request({
    url: api() + 'discountRate/search',
    method: 'get',
    params
  });
}
// 新增贴现率（id101）
function searchLiscount(resultDate: any, callback: (a: any) => void) {
  searchLiscountRate(resultDate)
    .then((res: any) => {
      if(res.success) {
        callback(res);
      } else {
        Vue.prototype.$message.error("贴现率获取失败:" + res.errorMsg);
      }
    })
    .catch((err: any) => {
      Vue.prototype.$message.error("接口失败:" + err.errorMsg);
    });
}
// 贷款利率查询（id99）
function searchLending(resultDate: any, callback: (a: any) => void) {
  searchLendingRate(resultDate)
    .then((res: any) => {
      if(res.success) {
        callback(res);
      } else {
        Vue.prototype.$message.error("贷款利率获取失败:" + res.errorMsg);
      }
    })
    .catch((err: any) => {
      Vue.prototype.$message.error("接口失败:" + err.errorMsg);
    });
}
export { searchLending, searchLiscount };