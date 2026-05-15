import { FormItemRule } from 'naive-ui';

/**
 * @description: 角色权限新增/编辑表单输入参数
 */
export interface RoleItemForm {
  name: null | string;
  roleCode: null | string;
  roleType: null | number;
  menuPermission: string[];
  apiPermission: string[];
}

/**
 * @description: 角色权限新增/编辑表单输入权限
 */
export interface RoleItemFormRules {
  name: FormItemRule;
  roleCode: FormItemRule;
  roleType: FormItemRule;
}
