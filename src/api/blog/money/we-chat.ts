import { AxiosBlog } from '@/api/axios';

const basic = '/money/we-chat';

/**
 * @description: 微信账单列表
 * @param {any} data
 */
export const getPage = (data: any) => {
  return AxiosBlog.request({
    url: `${basic}/find_page`,
    method: 'POST',
    data,
  });
};

/**
 * @description: 批量保存账单
 * @param {any} data
 */
export const batchSave = (data: any) => {
  return AxiosBlog.request({
    url: `${basic}/batch-save`,
    method: 'POST',
    data,
  });
};

/**
 * @description: 修改微信账单
 * @param {any} data
 */
export const update = (data: any) => {
  return AxiosBlog.request({
    url: `${basic}/update`,
    method: 'PUT',
    data,
  });
};

/**
 * @description: 处理微信账单余额
 * @param {any} params
 */
export const updateBalance = (params: any) => {
  return AxiosBlog.request({
    url: `${basic}/update_balance`,
    method: 'PUT',
    params,
  });
};
