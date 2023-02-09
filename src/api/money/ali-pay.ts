import { AxiosMoney } from '@/api/axios';

const basic = '/ali-pay';

/**
 * @description: 支付宝账单列表
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
 * @description: 修改支付宝账单
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
 * @description: 处理支付宝账单余额
 */
export const updateBalance = () => {
  return AxiosMoney.request({
    url: `${basic}/update_balance`,
    method: 'PUT',
  });
};
