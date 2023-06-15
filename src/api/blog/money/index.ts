import { AxiosBlog } from '@/api/axios';

const basic = '/money';

/**
 * @description: 统计银行数据的流动
 * @param {any} params
 */
export const getStatisticsBankFlow = (params?: any) => {
  return AxiosBlog.request({
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
  return AxiosBlog.request({
    url: `${basic}/statistics_money_balance`,
    method: 'GET',
    params,
  });
};

/**
 * @description: 统计某时间范围内的方式流入/流出的金额
 * @param {any} params
 */
export const statisticsInflowOrOutflowMoney = (params?: any) => {
  return AxiosBlog.request({
    url: `${basic}/statistics_inflow_or_outflow_money`,
    method: 'GET',
    params,
  });
};
