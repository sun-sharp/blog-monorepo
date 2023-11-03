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

/**
 * @description: 获取近六个月的时间间隔(格式化后的数据)
 * @param {string} formatStr
 * @return {[string, string]}
 */
export const lastHalfYearFormatRange = (formatStr: string): [string, string] => {
  const nowTime = new Date();
  const year = nowTime.getFullYear();
  const month = nowTime.getMonth();
  let day = 0;
  for (let i = 0; i < 6; i++) {
    if (month - i >= 0) {
      day += new Date(year, month - i, 0).getDate();
    } else {
      day += new Date(year - 1, 12 + month - i, 0).getDate();
    }
  }
  console.log(day);
  return [format(nowTime.getTime() - day * 24 * 60 * 60 * 1000, formatStr), format(nowTime, formatStr)];
};

/**
 * @description: 获取近一年的时间间隔(格式化后的数据)
 * @param {string} formatStr
 * @return {[string, string]}
 */
export const lastYearFormatRange = (formatStr: string): [string, string] => {
  const nowTime = new Date();
  const year = nowTime.getFullYear();
  const month = nowTime.getMonth();
  let day = 0;
  for (let i = 0; i < 12; i++) {
    if (month - i >= 0) {
      day += new Date(year, month - i, 0).getDate();
    } else {
      day += new Date(year - 1, 12 + month - i, 0).getDate();
    }
  }
  console.log(day);
  return [format(nowTime.getTime() - day * 24 * 60 * 60 * 1000, formatStr), format(nowTime, formatStr)];
};

/**
 * 某年全部的天数
 * @param {number} year
 * @returns {number}
 */
export const certainYearAllDays = (year: number): number => {
  let sum_day = 0;
  // 下面计算每个月的天数
  for (let i = 0; i < 12; i++) {
    const d = new Date(year, i, 0).getDate();
    sum_day += d;
  }
  return sum_day;
};

/**
 * 某年1月1日到这年某月某日的天数
 * @param {Date} defaultDate
 * @returns {number}
 */
export const certainDateSpendDays = (defaultDate: Date): number => {
  let sum_day = 0;
  const year = defaultDate.getFullYear();
  const month = defaultDate.getMonth();
  const date = defaultDate.getDate();
  // 下面计算每个月的天数
  for (let i = 5; i <= month; i++) {
    if (i === month) {
      const d = date;
      sum_day += d;
    } else {
      const d = new Date(year, i, 0).getDate();
      sum_day += d;
    }
  }
  return sum_day;
};

/**
 * 对以前时间进行判断并格式化分钟
 * @param {number} time
 * @param {string} formatStr
 * @returns {string}
 */
export const judgeRangeToFormatTime = (time: string, formatStr?: string): string => {
  const d = new Date(time);
  const now = Date.now();
  const spendDays = certainDateSpendDays(new Date());
  const diff = (now - d.getTime()) / 1000;
  if (diff < 30) {
    // 30s以内
    return '刚刚';
  } else if (diff < 3600) {
    // 1 小时内
    return Math.ceil(diff / 60) + '分钟前';
  } else if (diff < 3600 * 24) {
    // 1 天内
    return Math.ceil(diff / 3600) + '小时前';
  } else if (diff < 3600 * 24 * 2) {
    return '昨天';
  } else if (diff < 3600 * 24 * 3) {
    return '前天';
  } else if (diff < 3600 * 24 * spendDays) {
    return format(d, 'MM月dd日 HH:mm');
  }
  if (formatStr) {
    return format(d, formatStr);
  } else {
    return format(d, 'yyyy年MM月dd日 HH:mm');
  }
};

/**
 * 对未来时间进行判断并格式化分钟
 * @param {number} time
 * @param {string} formatStr
 * @returns {string}
 */
export const judgeRangeToFormatFutureTime = (time: string, formatStr?: string): string => {
  const d = new Date(time);
  const now = Date.now();
  const spendDays = certainDateSpendDays(new Date());
  const diff = (d.getTime() - now) / 1000;
  if (diff < 0) {
    // 负数
    return judgeRangeToFormatTime(time, formatStr);
  } else if (diff < 3600) {
    // 1 小时内
    return `剩${Math.ceil(diff / 60)}分钟`;
  } else if (diff < 3600 * 24) {
    // 1 天内
    return `剩${Math.ceil(diff / 3600)}小时`;
  } else if (diff < 3600 * 24 * 2) {
    return '明天';
  } else if (diff < 3600 * 24 * 3) {
    return '后天';
  } else if (diff < 3600 * 24 * spendDays) {
    return format(d, 'MM月dd日 HH:mm');
  }
  if (formatStr) {
    return format(d, formatStr);
  } else {
    return format(d, 'yyyy年MM月dd日 HH:mm');
  }
};
