/**
 * 将 UTC 时间（Date 对象或 ISO 字符串）格式化为 "YYYY-MM-DD HH:mm:ss"
 * 注意：输出值保留 UTC 时间本身，不进行时区转换
 * @param {Date | string} dateInput - Date 对象或 UTC 时间字符串（如 "2024-01-01T00:16:49.000Z"）
 * @returns {string} 格式化后的日期时间字符串
 * @throws {Error} 如果日期无效
 */
export const formatUTCToLocalString = (dateInput: Date | string): string => {
  // 统一转为 Date 对象
  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;

  // 校验日期有效性
  if (!(date instanceof Date) || isNaN(date.getTime())) {
    return 'Invalid Date';
  }

  // 提取 UTC 各分量
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  const hours = String(date.getUTCHours()).padStart(2, '0');
  const minutes = String(date.getUTCMinutes()).padStart(2, '0');
  const seconds = String(date.getUTCSeconds()).padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

/**
 * @description: 时间，日期转化
 * @param {string | Date} defaultTime
 * @return {string} yyyy-MM-DD HH:mm:ss
 */
export const nowDateFun = (defaultTime?: string | Date): string => {
  const newDate = defaultTime ? new Date(defaultTime) : new Date();
  const year = `${newDate.getFullYear()}`;
  let month = `${newDate.getMonth() + 1}`;
  let day = `${newDate.getDate()}`;
  let hour = `${newDate.getHours()}`;
  let min = `${newDate.getMinutes()}`;
  let sec = `${newDate.getSeconds()}`;
  month = Number(month) < 10 ? `0${month}` : month;
  day = Number(day) < 10 ? `0${day}` : day;
  hour = Number(hour) < 10 ? `0${hour}` : hour;
  min = Number(min) < 10 ? `0${min}` : min;
  sec = Number(sec) < 10 ? `0${sec}` : sec;
  return `${year}-${month}-${day} ${hour}:${min}:${sec}`;
};

/**
 * @description: 获取时间戳
 * @param {string} defaultTime
 * @return {number}
 */
export const getTimeStamp = (defaultTime?: string): number => {
  const time = defaultTime ? new Date(defaultTime) : new Date();
  return time.getTime();
};

/**
 * @description: 判断是否为日期格式
 * @param {string} time
 * @return {boolean}
 */
export const isDateFormat = (time: string): boolean => {
  return !isNaN(Date.parse(time));
};
