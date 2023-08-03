/**
 * @description: 银行账单的id
 */
export interface ApiBankId {
  // 银行账单id
  bankId: string;
}

/**
 * @description: 银行账单数据字段
 */
export interface ApiBank {
  // 用户id
  userId: string;

  // 交易时间
  tradeTime: string;

  // 交易类型
  tradeType: string;

  // 银行类型
  bankType: number;

  // 凭证类型
  voucherType: number;

  // 凭证号码
  voucherNo: string;

  // 交易对方
  tradeOtherPerson: string;

  // 交易对方账号
  tradeOtherPersonAccount: string;

  // 交易对方备注
  tradeOtherPersonRemarks: string;

  // 收/支
  incomeOrPay: string;

  // 交易金额
  moneyAmount: number;

  // 余额
  balance: number;

  // 其它费用
  otherCost: number;

  // 流入/流出
  inflowOrOutflow: number;

  // 账单说明
  explain: string;

  // 使用地点
  place: string;

  // 银行账单类型
  bankBillType: number;
}

/**
 * @description: 银行账单的列表每项
 */
export interface ApiBankItem extends ApiBank, ApiBankId {}

/**
 * @description: 银行账单的列表每项
 */
export interface ApiBankUpload {
  // 银行类型
  bankType: number;
  // 凭证号码
  voucherNo: string;
  // 凭证类型
  voucherType: number;
  // 交易时间
  tradeTime: string;
  // 账单说明
  explain: string;
  // 收/支
  incomeOrPay: string;
  // 交易金额
  moneyAmount: number;
  // 余额
  balance: number;
  // 交易对方
  tradeOtherPerson: string;
  // 交易对方账号
  tradeOtherPersonAccount: string;
  // 交易类型
  tradeType: string;
  // 银行账单类型
  bankBillType: number;
}
