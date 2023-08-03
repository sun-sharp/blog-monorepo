/**
 * @description: 微信账号的id
 */
export interface ApiWeChatId {
  // 微信账号id
  weChatId: string;
}

/**
 * @description: 微信账号数据字段
 */
export interface ApiWeChat {
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

  // 商品
  goods: string;

  // 收/支
  incomeOrPay: string;

  // 金额(元)
  moneyAmount: number;

  // 其它费用
  otherCost: number;

  // 支付方式
  paymentMethod: string;

  // 当前状态
  currentStatus: string;

  // 备注
  remarks: string;

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
}

/**
 * @description: 微信账号的列表每项
 */
export interface ApiWeChatItem extends ApiWeChat, ApiWeChatId {}

/**
 * @description: 微信账号的列表每项
 */
export interface ApiWeChatUpload {
  // 交易时间
  tradeTime: string;
  // 交易类型
  tradeType: string;
  // 交易对方
  tradeOtherPerson: string;
  // 商品
  goods: string;
  // 收/支
  incomeOrPay: string;
  // 金额(元)
  moneyAmount: number;
  // 支付方式
  paymentMethod: string;
  // 当前状态
  currentStatus: string;
  // 备注
  remarks: string;
  // 账单方式
  billMethod: number;
}
