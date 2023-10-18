import { AxiosBlog } from '@/api/axios';
import { ApiWeChatBatchSaveData, ApiWeChatFindPageData, ApiWeChatItem, ApiWeChatUpdateData } from '/#/api/we-chat';
import { TablePaginationResult } from '/#/components/table';
import { ApiStartEndTimeParams } from '/#/api/common';

const basic = '/money/we-chat';

/**
 * @description: 微信账单列表
 * @param {ApiWeChatFindPageData} data
 */
export const getPage = (data: ApiWeChatFindPageData): Promise<TablePaginationResult<ApiWeChatItem[]>> => {
  return AxiosBlog.request({
    url: `${basic}/find_page`,
    method: 'POST',
    data,
  });
};

/**
 * @description: 批量保存账单
 * @param {ApiWeChatBatchSaveData} data
 * @returns {Promise<undefined>}
 */
export const batchSave = (data: ApiWeChatBatchSaveData): Promise<undefined> => {
  return AxiosBlog.request({
    url: `${basic}/batch-save`,
    method: 'POST',
    data,
  });
};

/**
 * @description: 修改微信账单
 * @param {ApiWeChatUpdateData} data
 * @returns {Promise<undefined>}
 */
export const update = (data: ApiWeChatUpdateData): Promise<undefined> => {
  return AxiosBlog.request({
    url: `${basic}/update`,
    method: 'PUT',
    data,
  });
};

/**
 * @description: 处理微信账单余额
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
