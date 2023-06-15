/**
 * @description: 时间，日期转化
 * @param {string} defaultTime
 * @return {string}
 */
export const nowDateFun = (defaultTime?: string): string => {
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
