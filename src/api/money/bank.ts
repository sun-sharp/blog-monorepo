import { AxiosMoney } from '@/api/axios';

const basic = '/bank';

/**
 * @description: 银行账单列表
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
 * @description: 批量保存银行账单
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
 * @description: 修改银行账单
 * @param {any} data
 */
export const update = (data: any) => {
  return AxiosMoney.request({
    url: `${basic}/update`,
    method: 'PUT',
    data,
  });
};

/**
 * @description: 批量删除银行账单
 * @param {any} data
 */
export const batchRemove = (data: any) => {
  return AxiosMoney.request({
    url: `${basic}/batch_remove`,
    method: 'DELETE',
    data,
  });
};

/**
 * @description: 删除银行账单
 * @param {string} bankId
 */
export const remove = (bankId: string) => {
  return AxiosMoney.request({
    url: `${basic}/remove/${bankId}`,
    method: 'DELETE',
  });
};
