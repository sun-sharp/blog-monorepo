/**
 * @description: 银行数据流动数据
 */
export interface ApiBankFlow {
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
 * @description: 银行数据流动数据返回
 */
export interface ApiBankFlowResult {
  // 工商银行
  business: ApiBankFlow;
  // 农业银行
  agriculture: ApiBankFlow;
  // 建设银行
  build: ApiBankFlow;
  // 民生银行
  civil: ApiBankFlow;
  // 招商银行
  attractInvestment: ApiBankFlow;
}

/**
 * @description: 统计各个的方式的余额返回
 */
export interface ApiMoneyBalanceResult {
  // 微信余额
  weChatBalance: number;
  // 支付宝余额
  aliPayBalance: number;
  // 支付宝余额宝
  aliPayBalanceBaby: number;
  // 工商银行余额
  businessBank: number;
  // 农业银行余额
  agricultureBank: number;
  // 建设银行余额
  buildBank: number;
  // 民生银行余额
  civilBank: number;
  // 招商银行余额
  attractInvestmentBank: number;
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
