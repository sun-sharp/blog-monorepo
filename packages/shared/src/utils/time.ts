/**
 * 自定义日期格式化（支持星期几、AM/PM、12小时制）
 * @param {Date|number|string} date - 日期对象、时间戳（毫秒）或日期字符串
 * @param {string} fmt - 格式字符串，如 'yyyy-MM-dd EEEE a hh:mm:ss'
 * @returns {string} 格式化后的日期
 */
export const format = (date: any, fmt: string) => {
  // 1. 统一转 Date
  const d = date instanceof Date ? date : new Date(date);
  if (isNaN(d.getTime())) throw new Error('Invalid date');

  // 2. 提取时间分量
  const hours = d.getHours();
  const hours12 = hours % 12 || 12; // 12小时制（0点→12）
  const ampm = hours >= 12 ? 'PM' : 'AM';

  const weekdaysFull = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];
  const weekdaysShort = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const weekdaysChineseShort = ['日', '一', '二', '三', '四', '五', '六'];
  const dayIndex = d.getDay();

  // 3. 令牌映射表（注意值已经过处理）
  const tokens: any = {
    yyyy: d.getFullYear(),
    MM: String(d.getMonth() + 1).padStart(2, '0'),
    dd: String(d.getDate()).padStart(2, '0'),
    HH: String(hours).padStart(2, '0'), // 24小时制
    hh: String(hours12).padStart(2, '0'), // 12小时制
    mm: String(d.getMinutes()).padStart(2, '0'),
    ss: String(d.getSeconds()).padStart(2, '0'),
    EEEE: weekdaysFull[dayIndex], // 完整星期（Monday）
    E: weekdaysShort[dayIndex], // 简写星期（Mon）
    W: weekdaysChineseShort[dayIndex], //星期（汉字）
    a: ampm, // AM/PM
  };

  // 4. 替换（注意长令牌优先）
  return fmt.replace(
    /yyyy|EEEE|HH|hh|MM|dd|mm|ss|E|a/g,
    (match) => tokens[match],
  );
}

/**
 * @description 近一个月的时间范围
 * @param {string} formatStr
 * @return {*}  {[string, string]}
 */
export const nearlyMonthFormatRange = (formatStr: string): [string, string] => {
  const nowTime = new Date();
  const year = nowTime.getFullYear();
  const month = nowTime.getMonth();
  const day = new Date(year, month, 0).getDate();
  return [
    format(nowTime.getTime() - day * 24 * 60 * 60 * 1000, formatStr),
    format(nowTime, formatStr),
  ];
};

/**
 * @description 近半年的时间范围
 * @param {string} formatStr
 * @return {*}  {[string, string]}
 */
export const lastHalfYearFormatRange = (
  formatStr: string,
): [string, string] => {
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
  return [
    format(nowTime.getTime() - day * 24 * 60 * 60 * 1000, formatStr),
    format(nowTime, formatStr),
  ];
};

/**
 * @description 上个月的时间范围
 * @param {string} formatStr
 * @return {*}  {[string, string]}
 */
export const lastMonthFormatRange = (formatStr: string): [string, string] => {
  const nowTime = new Date();
  const year = nowTime.getFullYear();
  const month = nowTime.getMonth();
  const day = new Date(year, month, 0).getDate();
  return [
    format(new Date(year, month - 1, 1), formatStr),
    format(new Date(year, month - 1, day), formatStr),
  ];
};

/**
 * @description 上半年的时间范围
 * @param {string} formatStr
 * @return {*}  {[string, string]}
 */
export const lastYearFormatRange = (formatStr: string): [string, string] => {
  const nowTime = new Date();
  const year = nowTime.getFullYear() - 1;
  const day = new Date(year, 12, 0).getDate();
  return [
    format(new Date(year, 0, 1), formatStr),
    format(new Date(year, 11, day), formatStr),
  ];
};

/**
 * @description 今年1月1日至现在的时间范围
 * @param {string} formatStr
 * @return {*}  {[string, string]}
 */
export const thisYearFormatRange = (formatStr: string): [string, string] => {
  const nowTime = new Date();
  const year = nowTime.getFullYear();
  return [format(new Date(year, 0, 1), formatStr), format(nowTime, formatStr)];
};

/**
 * @description 今年1月1日至6月底的时间范围
 * @param {string} formatStr
 * @return {*}  {[string, string]}
 */
export const firstHalfYearFormatRange = (
  formatStr: string,
): [string, string] => {
  const nowTime = new Date();
  const year = nowTime.getFullYear();
  const month = nowTime.getMonth();
  let endTime = nowTime;
  if (month > 6) {
    const day = new Date(year, 6, 0).getDate();
    endTime = new Date(year, 5, day);
  }
  return [format(new Date(year, 0, 1), formatStr), format(endTime, formatStr)];
};

/**
 * @description 今年5月初至现在的时间范围
 * @param {string} formatStr
 * @return {*}  {[string, string]}
 */
export const secondHalfYearFormatRange = (
  formatStr: string,
): [string, string] => {
  const nowTime = new Date();
  const year = nowTime.getFullYear();
  return [format(new Date(year, 5, 1), formatStr), format(nowTime, formatStr)];
};

/**
 * @description 近一年的时间范围
 * @param {string} formatStr
 * @return {*}  {[string, string]}
 */
export const nearlyYearFormatRange = (formatStr: string): [string, string] => {
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
  return [
    format(nowTime.getTime() - day * 24 * 60 * 60 * 1000, formatStr),
    format(nowTime, formatStr),
  ];
};
/**
 * @description 某年的全部天数
 * @param {number} year
 * @return {number}
 */
export const certainYearAllDays = (year: number): number => {
  let sum_day = 0;
  for (let i = 0; i < 12; i++) {
    const d = new Date(year, i, 0).getDate();
    sum_day += d;
  }
  return sum_day;
};

/**
 * @description 5月1日至现在的全部天数
 * @param {Date} defaultDate
 * @return {number}
 */
export const certainDateSpendDays = (defaultDate: Date): number => {
  let sum_day = 0;
  const year = defaultDate.getFullYear();
  const month = defaultDate.getMonth();
  const date = defaultDate.getDate();
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
 * @description 判断过去时间离现在多久并格式化时间
 * @param {string} time
 * @param {string} formatStr
 * @return {string}
 */
export const judgeRangeToFormatTime = (
  time: string,
  formatStr?: string,
): string => {
  const d = new Date(time);
  const now = Date.now();
  const spendDays = certainDateSpendDays(new Date());
  const diff = (now - d.getTime()) / 1000;
  if (diff < 30) {
    return '刚刚';
  } else if (diff < 3600) {
    return Math.ceil(diff / 60) + '分钟前';
  } else if (diff < 3600 * 24) {
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
 * @description 判断未来时间离现在多久并格式化时间
 * @param {string} time
 * @param {string} formatStr
 * @return {string}
 */
export const judgeRangeToFormatFutureTime = (
  time: string,
  formatStr?: string,
): string => {
  const d = new Date(time);
  const now = Date.now();
  const spendDays = certainDateSpendDays(new Date());
  const diff = (d.getTime() - now) / 1000;
  if (diff < 0) {
    return judgeRangeToFormatTime(time, formatStr);
  } else if (diff < 3600) {
    return `剩${Math.ceil(diff / 60)}分钟`;
  } else if (diff < 3600 * 24) {
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
