import { FormItemRule } from 'naive-ui';

/**
 * @description: 分页参数
 */
export interface CategoryItemForm {
  type: null | string;
  value?: null | number;
  valueStr?: null | string;
  label: null | string;
}

/**
 * @description: 分页添加修改验证
 */
export interface CategoryItemFormRules {
  type: FormItemRule;
  value: FormItemRule;
  valueStr: FormItemRule;
  label: FormItemRule;
}
