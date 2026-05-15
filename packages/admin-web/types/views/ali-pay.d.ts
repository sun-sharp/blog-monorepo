import { FormItemRule } from 'naive-ui';
import { ApiAliPayBase, ApiAliPayCreate } from '/#/api/ali-pay';

/**
 * @description:  支付宝账单 编辑表单 输入参数
 */
export interface AliPayItemForm extends ApiAliPayBase, ApiAliPayCreate {
  moneyAmount: number | null;
  otherCost: number | null;
  inflowOrOutflow: number | null;
  billType: number | null;
  billMethod: number | null;
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
