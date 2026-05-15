import { FormItemRule } from 'naive-ui';

/**
 * @description:  日程 编辑表单 输入参数
 */
export interface ScheduleForm {
  title: string;
  // 日程内容
  content: string;
  // 开始日期
  startDate: null | string;
  // 结束日期
  endDate: null | string;
  // 开始时间
  startTime: null | string;
  // 结束时间
  endTime: null | string;
}

/**
 * @description: 日程 编辑表单 输入权限
 */
export interface ScheduleFormRules {
  title: FormItemRule;
  // 日程内容
  content: FormItemRule;
  // 开始日期
  startDate: FormItemRule;
  // 结束日期
  endDate: FormItemRule;
}

/**
 * @description: 每日 日程数据
 */
export interface ScheduleDailyItem {
  time?: string;
  children?: Array;
}
