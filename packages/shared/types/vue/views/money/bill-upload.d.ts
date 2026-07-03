import { BillUploadFields } from '/#/api/blog/bill-upload';
/**
 * @description: 全局类型新增/编辑表单输入参数
 * 表单接口：所有字段可为 null（且必须存在）
 */
export type BillUploadItemForm = {
  [K in keyof BillUploadFields]: BillUploadFields[K] | null;
};

/**
 * @description: 全局类型新增/编辑表单输入权限
 */
export type BillUploadItemFormRules = {
  [K in keyof BillUploadFields]: FormItemRule;
};
