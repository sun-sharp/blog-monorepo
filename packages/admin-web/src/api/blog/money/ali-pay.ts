import { AxiosBlog } from '@/api/axios';
import { ApiAliPayBatchSaveData, ApiAliPayFindPageData, ApiAliPayItem, ApiAliPayUpdateData } from '/#/api/ali-pay';
import { TablePaginationResult } from '/#/components/table';
import { ApiStartEndTimeParams } from '/#/api/common';

const basic = '/money/ali-pay/';

/**
 * @description: 支付宝账单列表
 * @param {ApiAliPayFindPageData} data
 * @returns {Promise<TablePaginationResult<ApiAliPayItem[]>>}
 */
export const getPage = (data: ApiAliPayFindPageData): Promise<TablePaginationResult<ApiAliPayItem[]>> => {
  return AxiosBlog.request({
    url: `${basic}/find_page`,
    method: 'POST',
    data,
  });
};

/**
 * @description: 批量保存账单
 * @param {ApiAliPayBatchSaveData} data
 * @returns {Promise<undefined>}
 */
export const batchSave = (data: ApiAliPayBatchSaveData): Promise<undefined> => {
  return AxiosBlog.request({
    url: `${basic}/batch-save`,
    method: 'POST',
    data,
  });
};

/**
 * @description: 修改支付宝账单
 * @param {ApiAliPayUpdateData} data
 */
export const update = (data: ApiAliPayUpdateData): Promise<undefined> => {
  return AxiosBlog.request({
    url: `${basic}/update`,
    method: 'PUT',
    data,
  });
};

/**
 * @description: 处理支付宝账单余额
 * @param {ApiStartEndTimeParams} params
 * @returns {Promise<undefined>}
 */
export const updateBalance = (params: ApiStartEndTimeParams): Promise<undefined> => {
  return AxiosBlog.request({
    url: `${basic}/update_balance`,
    method: 'PUT',
    params,
  });
};

/**
 * @description: 处理支付宝账单余额宝
 * @param {ApiStartEndTimeParams} params
 * @returns {Promise<undefined>}
 */
export const updateBalanceBaby = (params: ApiStartEndTimeParams): Promise<undefined> => {
  return AxiosBlog.request({
    url: `${basic}/update_balance_baby`,
    method: 'PUT',
    params,
  });
};
