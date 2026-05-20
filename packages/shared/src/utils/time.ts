import { format } from 'date-fns';

export const nearlyMonthFormatRange = (formatStr: string): [string, string] => {
  const nowTime = new Date();
  const year = nowTime.getFullYear();
  const month = nowTime.getMonth();
  const day = new Date(year, month, 0).getDate();
  return [format(nowTime.getTime() - day * 24 * 60 * 60 * 1000, formatStr), format(nowTime, formatStr)];
};

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
  return [format(nowTime.getTime() - day * 24 * 60 * 60 * 1000, formatStr), format(nowTime, formatStr)];
};

export const lastMonthFormatRange = (formatStr: string): [string, string] => {
  const nowTime = new Date();
  const year = nowTime.getFullYear();
  const month = nowTime.getMonth();
  const day = new Date(year, month, 0).getDate();
  return [format(new Date(year, month - 1, 1), formatStr), format(new Date(year, month - 1, day), formatStr)];
};

export const lastYearFormatRange = (formatStr: string): [string, string] => {
  const nowTime = new Date();
  const year = nowTime.getFullYear() - 1;
  const day = new Date(year, 12, 0).getDate();
  return [format(new Date(year, 0, 1), formatStr), format(new Date(year, 11, day), formatStr)];
};

export const thisYearFormatRange = (formatStr: string): [string, string] => {
  const nowTime = new Date();
  const year = nowTime.getFullYear();
  return [format(new Date(year, 0, 1), formatStr), format(nowTime, formatStr)];
};

export const firstHalfYearFormatRange = (formatStr: string): [string, string] => {
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

export const secondHalfYearFormatRange = (formatStr: string): [string, string] => {
  const nowTime = new Date();
  const year = nowTime.getFullYear();
  return [format(new Date(year, 5, 1), formatStr), format(nowTime, formatStr)];
};

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
  return [format(nowTime.getTime() - day * 24 * 60 * 60 * 1000, formatStr), format(nowTime, formatStr)];
};

export const certainYearAllDays = (year: number): number => {
  let sum_day = 0;
  for (let i = 0; i < 12; i++) {
    const d = new Date(year, i, 0).getDate();
    sum_day += d;
  }
  return sum_day;
};

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

export const judgeRangeToFormatTime = (time: string, formatStr?: string): string => {
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

export const judgeRangeToFormatFutureTime = (time: string, formatStr?: string): string => {
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
