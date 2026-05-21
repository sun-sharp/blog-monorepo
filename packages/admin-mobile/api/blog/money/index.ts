import { blogRequest } from '../../../utils/request';
import type { ApiBankFlowResult, ApiInflowOrOutflowMoneyResult, ApiMoneyBalanceResult } from '/#/api/blog/money';
import type { ApiStartEndTimeParams } from '/#/api/common';

const basic = '/money';

export const statisticsMoneyBalance = (): Promise<ApiMoneyBalanceResult[]> => {
  return blogRequest({ url: `${basic}/statistics_money_balance`, method: 'GET' });
};

export const getStatisticsBankFlow = (params: ApiStartEndTimeParams): Promise<ApiBankFlowResult[]> => {
  return blogRequest({ url: `${basic}/statistics_bank_flow`, method: 'GET', params });
};

export const statisticsInflowOrOutflowMoney = (params: ApiStartEndTimeParams): Promise<ApiInflowOrOutflowMoneyResult> => {
  return blogRequest({ url: `${basic}/statistics_inflow_or_outflow_money`, method: 'GET', params });
};
