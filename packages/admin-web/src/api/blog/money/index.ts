import { AxiosBlog } from '@/api/axios';
import { ApiBankFlowResult, ApiInflowOrOutflowMoneyResult, ApiMoneyBalanceResult } from '/#/api/money';
import { ApiStartEndTimeParams } from '/#/api/common';

const basic = '/money';

/**
 * @description: 统计银行数据的流动
 * @returns {Promise<ApiMoneyBalanceResult[]>}
 */
export const statisticsMoneyBalance = (): Promise<ApiMoneyBalanceResult[]> => {
  return AxiosBlog.request({
    url: `${basic}/statistics_money_balance`,
    method: 'GET',
    // params,
  });
};

/**
 * @description: 统计银行数据的流动
 * @param {ApiStartEndTimeParams} params
 * @returns {Promise<ApiBankFlowResult[]>}
 */
export const getStatisticsBankFlow = (params: ApiStartEndTimeParams): Promise<ApiBankFlowResult[]> => {
  return AxiosBlog.request({
    url: `${basic}/statistics_bank_flow`,
    method: 'GET',
    params,
  });
};

/**
 * @description: 统计某时间范围内的方式流入/流出的金额
 * @param {ApiStartEndTimeParams} params
 * @returns {Promise<ApiInflowOrOutflowMoneyResult>}
 */
export const statisticsInflowOrOutflowMoney = (params: ApiStartEndTimeParams): Promise<ApiInflowOrOutflowMoneyResult> => {
  return AxiosBlog.request({
    url: `${basic}/statistics_inflow_or_outflow_money`,
    method: 'GET',
    params,
  });
};
