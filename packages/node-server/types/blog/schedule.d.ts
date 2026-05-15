/**
 * @description: 日程的id
 */
export interface ApiScheduleId {
  // 日程id
  scheduleId: string;
}

/**
 * @description: 日程数据字段
 */
export interface ApiSchedule {
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

  // 创建人物id
  userId: string;

  // 创建时间
  createTime: string;
}

/**
 * @description: 日程的列表每项
 */
export type ApiScheduleItem = ApiSchedule &
  ApiScheduleId & {
    // 创建人物昵称
    nickName: string;
  };
