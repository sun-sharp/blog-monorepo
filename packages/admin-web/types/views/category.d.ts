import { FormItemRule } from 'naive-ui';

/**
 * @description: 全局类型新增/编辑表单输入参数
 */
export interface CategoryItemForm {
  type: null | string;
  value?: null | number;
  valueStr?: null | string;
  label: null | string;
}

/**
 * @description: 全局类型新增/编辑表单输入权限
 */
export interface CategoryItemFormRules {
  type: FormItemRule;
  value: FormItemRule;
  valueStr: FormItemRule;
  label: FormItemRule;
}
