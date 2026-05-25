/**
 * @description: 过滤掉\n，空格
 * @param {any} str
 * @return {string}
 */
export const filterStr = (str: any): string => {
  if (typeof str !== 'string') {
    return str ? String(str) : '';
  }
  return str.replace(/\n/g, '').replace(/[ ]/g, '');
};

/**
 * @description: 处理数据为字符串，null和undefined转换为''
 * @param {any} val
 * @return {string}
 */
export const safeString = (val: any): string => {
  return val != null ? String(val) : '';
};
