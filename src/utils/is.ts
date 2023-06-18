/**
 * @description: 判断字符串内容为数组或对象
 * @param {string} str
 * @return {boolean}
 */
export const isJsonString = (str: string): boolean => {
  try {
    // 为对象和数组的时候会返回true，无法转换时会走catch
    return typeof JSON.parse(str) == 'object';
  } catch (e) {
    return false;
  }
};

/**
 * @description: 判断字符串内容为数字
 * @param {string} str
 * @return {boolean}
 */
export const isNumberString = (str: string): boolean => {
  return !isNaN(Number(str));
};
