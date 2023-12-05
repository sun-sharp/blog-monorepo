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

/**
 * @description: 判断数组相同
 * @param {Array} arr1
 * @param {Array} arr2
 * @return {boolean}
 */
export const isArrayEqual = (arr1: Array<string | number>, arr2: Array<string | number>): boolean => {
  return arr1.join(',') === arr2.join(',');
};
