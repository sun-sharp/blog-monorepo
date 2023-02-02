import { AxiosMoney } from '@/api/axios';

const basic = '';

/**
 * @description: 统计银行数据的流动
 * @param {any} params
 */
export const getStatisticsBankFlow = (params?: any) => {
  return AxiosMoney.request({
    url: `${basic}/statistics_bank_flow`,
    method: 'GET',
    params,
  });
};
