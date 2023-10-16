/**
 * @description: 将枚举值的数组形式转化成对象形式
 * @param {Array} arr
 * @param {string} value
 * @param {string} label
 */
export const arrEnumToObj = (
  arr: Array<any>,
  value: string = 'value',
  label: string = 'label'
): {
  [x: string]: string | number;
} => {
  const obj: any = {};
  arr.forEach((item) => {
    obj[item[value]] = item[label];
  });
  return obj;
};
