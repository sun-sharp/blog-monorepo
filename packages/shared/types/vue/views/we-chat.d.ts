import { FormItemRule } from 'naive-ui';

/**
 * @description:  微信账单 编辑表单 输入参数
 */
export interface WeChatItemForm {
  tradeTime: string;
  tradeType: string;
  tradeOtherPerson: string;
  tradeOtherPersonRemarks: string;
  goods: string;
  incomeOrPay: string;
  moneyAmount: number | null;
  otherCost: number | null;
  paymentMethod: string;
  currentStatus: string;
  remarks: string;
  explain: string;
  place: string;
  inflowOrOutflow: number | null;
  billType: number | null;
  billMethod: number | null;
  balance?: number;
}

/**
 * @description: 微信账单 编辑表单 输入权限
 */
export interface WeChatFormRules {
  inflowOrOutflow: FormItemRule;
  billMethod: FormItemRule;
  billType: FormItemRule;
}
