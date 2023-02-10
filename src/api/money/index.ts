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

/**
 * @description: 统计银行数据的流动
 * @param {any} params
 */
export const statisticsMoneyBalance = (params?: any) => {
  return AxiosMoney.request({
    url: `${basic}/statistics_money_balance`,
    method: 'GET',
    params,
  });
};

/**
 * @description: 统计某时间范围内的方式支出的金额
 * @param {any} params
 */
export const statisticsFlowOutMoney = (params?: any) => {
  return AxiosMoney.request({
    url: `${basic}/statistics_flow_out_money`,
    method: 'GET',
    params,
  });
};
