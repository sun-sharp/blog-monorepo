import { AxiosMoney } from '@/api/axios';

const basic = '/we-chat';

/**
 * @description: 微信账单列表
 * @param {any} data
 */
export const getPage = (data: any) => {
  return AxiosMoney.request({
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
  return AxiosMoney.request({
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
  return AxiosMoney.request({
    url: `${basic}/update`,
    method: 'PUT',
    data,
  });
};
