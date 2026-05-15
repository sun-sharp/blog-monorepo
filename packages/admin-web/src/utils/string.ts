/**
 * @description: 驼峰转下划线
 * @param {string} str
 * @return {string}
 */
export const toUnderscoreCase = (str: string): string => {
  return str
    .replace(/([a-z])([A-Z])/g, '$1_$2')
    .replace(/([A-Z])([A-Z])(?=[A-Z])/g, '$1_$2')
    .toLowerCase();
};

/**
 * @description: 下划线转驼峰
 * @param {string} str
 * @return {string}
 */
// export const underlineToCamel = (str: string): string => {
//   return str.replace(/\_(\w)/g, (_all, letter) => letter.toUpperCase());
// };

/**
 * @description: 转化大写首字母
 * @param {string} str
 * @return {string}
 */
export const toUpperCaseFirstLetter = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

/**
 * @description: 下划线转驼峰
 * @param {string} str
 * @return {string}
 */
export const underlineToCamel = (str: string, type: 'small' | 'big' = 'small'): string => {
  let resStr = str.replace(/\_(\w)/g, (_all, letter) => letter.toUpperCase());

  // 转小驼峰这一行不需要
  if (type === 'big') {
    resStr = resStr.slice(0, 1).toUpperCase() + resStr.slice(1);
  }

  return resStr;
};
