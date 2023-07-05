/**
 * @description: 给数字添加px单位，并转化为整数
 * @param {number} val
 */
export const intUnitPx = (val: number | string = 0) => {
  return parseInt(val + '') + 'px';
};
