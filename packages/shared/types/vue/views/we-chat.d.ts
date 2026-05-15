import { FormItemRule } from 'naive-ui';
import { ApiWeChatBase, ApiWeChatCreate } from '/#/api/we-chat';

/**
 * @description:  微信账单 编辑表单 输入参数
 */
export interface WeChatItemForm extends ApiWeChatBase, ApiWeChatCreate {
  moneyAmount: number | null;
  otherCost: number | null;
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
