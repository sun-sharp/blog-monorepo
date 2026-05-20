import { ApiPaginateParams } from '../common';

/**
 * @description: 日程查询传参
 */
export type ApiScheduleSearchParams = {
  // 关键字
  keywords?: string;
};

/**
 * @description: 条件并分页获取日程列表参数
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
 * @description: 日程保存参数
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
export interface ApiScheduleItem extends ApiSchedule, ApiScheduleId {
  // 创建人物昵称
  nickName: string;
}

/**
 * @description: 日程更新参数
 */
export type ApiScheduleUpdateData = ApiScheduleSaveData & ApiScheduleId;
