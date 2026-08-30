/**
 * 将数字四舍五入保留小数（返回数字类型）
 * @param {(number | string)} val
 * @param {number} [decimals=2]
 * @return {*}  {number}
 * @example roundToTwo(1.005) // 返回 1.01
 */
export const roundToTwoArrow = (val: number | string, decimals: number = 2): number => {
  const num = Number(val);
  const factor = Math.pow(10, decimals);
  if (isNaN(num)) {
    return 0;
  }
  // 防御性处理：非数字或无穷大直接返回原值或抛错
  if (!isFinite(num)) {
    return num;
  }
  return Math.round((num + Number.EPSILON) * factor) / factor;
};
