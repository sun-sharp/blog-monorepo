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

export const isArrayEqual = (arr1: Array<string | number>, arr2: Array<string | number>): boolean => {
  return arr1.join(',') === arr2.join(',');
};
