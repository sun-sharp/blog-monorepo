import { ApiPaginateParams } from './common';

/**
 * @description: 全局类型查询传参
 */
export type ApiScheduleSearchParams = {
  // 关键字
  keywords?: string;
};

/**
 * @description: 条件并分页获取全局类型列表参数
 */
export type ApiScheduleFindPageData = ApiPaginateParams & ApiScheduleSearchParams;

/**
 * @description: 日程的id
 */
export interface ApiScheduleId {
  // 日程id
  scheduleId: string;
}

/**
 * @description:  日程保存参数
 */
export interface ApiScheduleSaveData {
  // 日程的标题
  title: string;

  // 日程内容
  content: string;

  // 开始日期
  startDate: string;

  // 结束日期
  endDate: string;

  // 开始时间
  startTime: string;

  // 结束时间
  endTime: string;
}

/**
 * @description: 日程数据字段
 */
export interface ApiSchedule extends ApiScheduleSaveData {
  // 创建时间
  createTime: string;

  // 创建人物id
  userId: string;
}

/**
 * @description: 日程列表每项
 */
export type ApiScheduleItem = ApiSchedule & ApiScheduleId;

/**
 * @description:  日程保存参数
 */
export type ApiScheduleUpdateData = ApiScheduleSaveData & ApiScheduleId;
