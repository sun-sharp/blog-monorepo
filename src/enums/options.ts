// 将枚举值的数组形式转化成对象形式
const arrEnumToObj = (arr: Array<any>, value = 'value', label = 'label') => {
  const obj = {};
  arr.forEach((item) => {
    obj[item[value]] = item[label];
  });
  return obj;
};

// 菜单类型枚举值
export const menuTypeOption = [
  {
    value: 1,
    label: '一级目录',
  },
  {
    value: 2,
    label: '次级目录',
  },
  {
    value: 5,
    label: '菜单',
  },
  {
    value: 6,
    label: '内嵌',
  },
  {
    value: 7,
    label: '外链',
  },
];
export const menuTypeObj = arrEnumToObj(menuTypeOption);

// 角色权限类型枚举值
export const roleTypeOption = [
  {
    value: 1,
    label: '全部权限',
  },
  {
    value: 2,
    label: '自定义权限',
  },
];
export const roleTypeObj = arrEnumToObj(roleTypeOption);
