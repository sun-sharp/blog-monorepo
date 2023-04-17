import { format } from 'date-fns';

/**
 * @description: 获取近一个月的时间间隔(格式化后的数据)
 * @param {string} formatStr
 * @return {[string, string]}
 */
export const lastMonthFormatRange = (formatStr: string): [string, string] => {
  const nowTime = new Date();
  const year = nowTime.getFullYear();
  const month = nowTime.getMonth();
  const day = new Date(year, month, 0).getDate();
  return [format(nowTime.getTime() - day * 24 * 60 * 60 * 1000, formatStr), format(nowTime, formatStr)];
};
