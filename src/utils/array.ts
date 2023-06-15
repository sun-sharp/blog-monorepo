/**
 * @description: 将枚举值的数组形式转化成对象形式
 * @param {Array} arr
 * @param {any} value
 * @param {any} label
 * @return {*}
 */
export const arrEnumToObj = (arr: Array<any>, value: any = 'value', label: any = 'label'): any => {
  const obj = {};
  arr.forEach((item) => {
    obj[item[value]] = item[label];
  });
  return obj;
};
