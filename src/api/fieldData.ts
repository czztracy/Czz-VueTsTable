/* 字段库模块 */
import request from '@/utils/request';
export function searchFieldList() {
  return request({
    url: 'fieldList/searchFieldList',
    method: 'GET'
  });
}
