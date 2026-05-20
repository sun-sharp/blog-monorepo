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
 * @description: 银行数据流动数据
 */
export interface ApiBankFlow {
  // 凭证数量
  voucherNum?: number;
  // 开始余额
  startBalance: number;
  // 结束余额
  endBalance: number;
  // 流入金额
  inflowMoneyAmount: number;
  // 流出金额
  outflowMoneyAmount: number;
  // 凭证号码
  voucherNo?: string;
  // 凭证类型
  voucherType?: number;
  // 子项
  children?: ApiBankFlow[];
}

/**
 * @description: 银行数据流动数据返回
 */
export interface ApiBankFlowResult extends ApiBankFlow {
  // 名称
  name: string;
}

/**
 * @description: 统计各个的方式的余额返回
 */
export interface ApiMoneyBalanceResult {
  // 名称
  name: string;
  // 金额
  value: number;
}

/**
 * @description: 微信，支付宝流入/流出的金额
 */
export interface ApiAliPayAndWeChatChild {
  // 流入/流出
  inflowOrOutflow: number;
  // 交易金额
  moneyAmount: number;
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
 * @description: 流入/流出的金额统计结果
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
