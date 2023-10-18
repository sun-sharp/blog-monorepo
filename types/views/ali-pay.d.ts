import { FormItemRule } from 'naive-ui';

/**
 * @description:  支付宝账单 编辑表单 输入参数
 */
export interface AliPayItemForm {
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
  moneyAmount: number | null;

  // 收/付款方式
  paymentMethod: string;

  // 账单方式
  billMethod: number | null;

  // 账单类型
  billType: number | null;

  // 流入/流出
  inflowOrOutflow: number | null;

  tradeOtherPersonRemarks?: string;

  explain?: string;

  place?: string;

  balance?: number;

  balanceBaby?: number;
}

/**
 * @description: 支付宝账单 编辑表单 输入权限
 */
export interface AliPayFormRules {
  inflowOrOutflow: FormItemRule;
  billMethod: FormItemRule;
  billType: FormItemRule;
}
