import { FormItemRule } from 'naive-ui';

/**
 * @description:  支付宝账单 编辑表单 输入参数
 */
export interface AliPayItemForm {
  tradeTime: string;
  tradeType: string;
  tradeOtherPerson: string;
  tradeOtherPersonRemarks: string;
  productDescription: string;
  incomeOrPay: string;
  moneyAmount: number | null;
  otherCost: number | null;
  inflowOrOutflow: number | null;
  billType: number | null;
  billMethod: number | null;
  balance?: number;
  balanceBaby?: number;
  paymentMethod: string;
  oppositeAccount: string;
  explain: string;
  place: string;
}

/**
 * @description: 支付宝账单 编辑表单 输入权限
 */
export interface AliPayFormRules {
  inflowOrOutflow: FormItemRule;
  billMethod: FormItemRule;
  billType: FormItemRule;
}
