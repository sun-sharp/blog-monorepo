import { FormItemRule } from 'naive-ui';

/**
 * @description:  银行账单 编辑表单 输入参数
 */
export interface BankItemForm {
  tradeTime: string;
  tradeType: string;
  bankType: number | null;
  voucherType: number | null;
  voucherNo: string;
  tradeOtherPerson: string;
  tradeOtherPersonAccount: string;
  tradeOtherPersonRemarks: string;
  incomeOrPay: string;
  moneyAmount: number;
  balance: number;
  otherCost: number;
  explain: string;
  place: string;
  inflowOrOutflow: number | null;
  bankBillType: number | null;
}

/**
 * @description: 银行账单 编辑表单 输入权限
 */
export interface BankFormRules {
  inflowOrOutflow: FormItemRule;
  bankBillType: FormItemRule;
}
