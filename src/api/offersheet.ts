/* 报价单填报模块 */
import request from '@/utils/request';
// import Qs from 'qs'
/**
 * @Page：供应商填报
 * @ApiDesc：匹配历史报价单 ID52
 * @UsingRoles：供应商
 * @Author: 陈莉莎
 */
export function historys(data: any) {
  return request({
    url: 'task/getHistoryReportList',
    method: 'post',
    data
  });
}

/**
 * @Page：供应商填报
 * @ApiDesc：根据填报单标识查询填报单及数据 ID65
 * @UsingRoles：供应商
 * @Author: 陈莉莎
 */
export function hisXuanran(params: any) {
  return request({
    url: 'task/getReportData',
    method: 'get',
    params
  });
}

/**
 * @Page：供应商填报
 * @ApiDesc：填报单保存/提交 id53
 * @UsingRoles：供应商
 * @Author: 陈莉莎
 */
export function submitSave(params: any) {
  return request({
    url: 'report/saveReportData',
    method: 'post',
    // data: Qs.stringify(params)
    data: params
  });
}

/*
   * @Page：供应商填报
   * @ApiDesc：上传 待定，接口不正确
   * @UsingRoles：供应商
   * @Author: 陈莉莎
   */
export function requires(params: any) {
  return request({
    url: 'report/getInfoByRid',
    method: 'get',
    params
    // data: Qs.stringify(params)
  });
}

/*
   * @Page：供应商填报
   * @ApiDesc：贷款利率查询（id99）
   * @UsingRoles：供应商
   * @Author: 张聪聪
   */
export function searchLendingRate(params: any) {
  return request({
    url: 'lendingRate/searchLendingRate',
    method: 'post',
    params
  });
}
/*
   * @Page：供应商填报
   * @ApiDesc：新增贴现率（id101）
   * @UsingRoles：供应商
   * @Author: 张聪聪
   */
export function searchLiscountRate(params: any) {
  return request({
    url: 'discountRate/search',
    method: 'get',
    params
  });
}
