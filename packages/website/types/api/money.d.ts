/**
 * @description: 统计各种账单的余额类型
 */
export type MoneyBalanceType =
  | 'weChatBalance'
  | 'aliPayBalance'
  | 'aliPayBalanceBaby'
  | 'businessBank'
  | 'agricultureBank'
  | 'buildBank'
  | 'civilBank'
  | 'attractInvestmentBank';

/**
 * @description: 统计各个的方式的余额返回
 */
export interface ApiMoneyBalanceResult {
  name: string;
  value: number;
}

/**
 * @description: 银行数据流动数据返回
 */
export interface ApiBankFlowResult {
  name: string;
  voucherNum?: number;
  startBalance: number;
  endBalance: number;
  inflowMoneyAmount: number;
  outflowMoneyAmount: number;
  voucherNo?: string;
  voucherType?: number;
  children?: ApiBankFlow[];
}

/**
 * @description: 流入/流出的图表
 */
export interface ApiFlowChart {
  // 流入/流出的名称
  name: string;
  // 金额
  money: number;
}

/**
 * @description: 流入/流出的图表
 */
export interface ApiInflowOrOutflowMoneyResult {
  // 流出的总数
  outflowSumTotal: number;
  // 流出的图表
  outflowChart: ApiFlowChart[];
  // 流入的总数
  inflowSumTotal: number;
  // 流入的图表
  inflowChart: ApiFlowChart[];
}
