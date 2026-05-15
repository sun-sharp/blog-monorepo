import { FormItemRule } from 'naive-ui';
import { ApiBankBase, ApiBankCreate } from '/#/api/bank';

/**
 * @description:  银行账单 编辑表单 输入参数
 */
export interface BankItemForm extends ApiBankBase, ApiBankCreate {
  inflowOrOutflow: number | null;
  bankType: number | null;
  voucherType: number | null;
  bankBillType: number | null;
}

/**
 * @description: 银行账单 编辑表单 输入权限
 */
export interface BankFormRules {
  inflowOrOutflow: FormItemRule;
  bankBillType: FormItemRule;
}
