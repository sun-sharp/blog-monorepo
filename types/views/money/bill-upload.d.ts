// import { FormItemRule } from 'naive-ui';

/**
 * @description: 全局类型新增/编辑表单输入参数
 */
export interface BillUploadItemForm {
  // 账单导入类型
  billUploadType: null | number;
  // 账单类型
  billType: null | number;
  // 账单判断字段
  billJudgeKey: null | string;
  // 判断方式
  judgeWay: null | string;
  // 判断取值
  judgeVal: Array<string>;
  // 判断取值输入
  judgeInputVal: null | string;
  // 需处理类型
  handleType: null | number;
  // 流入/流出
  inflowOrOutflow: null | number;
  // 账单方式
  billMethod: null | number;
}

/**
 * @description: 全局类型新增/编辑表单输入权限
 */
export interface BillUploadItemFormRules {
  billUploadType: FormItemRule;
  billJudgeKey: FormItemRule;
  judgeWay: FormItemRule;
  handleType: FormItemRule;
  inflowOrOutflow: FormItemRule;
  billType: FormItemRule;
  billMethod: FormItemRule;
}
