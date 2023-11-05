/**
 * @description: 支付宝账单的id
 */
export interface ApiAliPayId {
  // 支付宝账单id
  aliPayId: string;
}

/**
 * @description: 支付宝账单数据字段
 */
export interface ApiAliPay {
  // 用户id
  userId: string;

  // 交易时间
  tradeTime: string;

  // 交易类型
  tradeType: string;

  // 交易对方
  tradeOtherPerson: string;

  // 交易对方备注
  tradeOtherPersonRemarks: string;

  // 商品说明
  productDescription: string;

  // 收/支
  incomeOrPay: string;

  // 金额(元)
  moneyAmount: number;

  // 其它费用
  otherCost: number;

  // 收/付款方式
  paymentMethod: string;

  // 对方账号
  oppositeAccount: string;

  // 流入/流出
  inflowOrOutflow: number;

  // 账单说明
  explain: string;

  // 使用地点
  place: string;

  // 账单类型
  billType: number;

  // 账单方式
  billMethod: number;

  // 余额
  balance: number;

  // 余额宝
  balanceBaby: number;
}

/**
 * @description: 支付宝账单的列表每项
 */
export interface ApiAliPayItem extends ApiAliPay, ApiAliPayId {}

/**
 * @description: 支付宝账单的导入信息
 */
export interface ApiAliPayUpload {
  // 交易时间
  tradeTime: string;

  // 交易类型
  tradeType: string;

  // 交易对方
  tradeOtherPerson: string;

  // 对方账号
  oppositeAccount: string;

  // 商品说明
  productDescription: string;

  // 收/支
  incomeOrPay: string;

  // 金额(元)
  moneyAmount: number;

  // 收/付款方式
  paymentMethod: string;

  // 交易状态
  tradeStatus: string;

  // 账单方式
  billMethod: number;

  // 账单类型
  billType: number;
}
