/**
 * 手动四舍五入保留两位小数（返回数字类型）
 * 通过字符串分割精确处理进位，避免浮点数精度问题
 * @param num - 待处理的数字
 * @returns 保留两位小数的数字（若整数进位后小数部分为 .00，返回整数）
 * @example
 * roundToTwoPrecise(1.005)   // 1.01
 * roundToTwoPrecise(2.345)   // 2.35
 * roundToTwoPrecise(1.999)   // 2   (数字类型无法显示 2.00，但符合“返回数字”的要求)
 */
export const roundToTwoPrecise = (num: number): number => {
  if (!isFinite(num)) return num; // 或 throw new Error(...)

  const [intPart, decPart = ''] = String(num).split('.');
  const dec = (decPart + '00').slice(0, 3);
  const carry = parseInt(dec[2] || '0', 10) >= 5 ? 1 : 0;
  const newDec = String(Number(dec.slice(0, 2)) + carry).padStart(2, '0');
  let newInt = Number(intPart);

  if (Number(newDec) >= 100) {
    newInt += 1;
    return newInt;
  }

  // 处理负数：保留负号
  return parseFloat(`${newInt >= 0 ? '' : '-'}${Math.abs(newInt)}.${newDec}`);
  // 但上述处理较复杂，简单起见直接用 parseFloat 即可（它已支持负号）
  // 注意：原逻辑中 intPart 已经包含负号，拼接时直接使用即可
};

/**
 * 将数字四舍五入保留两位小数（返回数字类型）
 * @param num 待处理的数字
 * @returns 保留两位小数的数字
 * @example roundToTwo(1.005) // 返回 1.01
 */
export const roundToTwoArrow = (num: number): number => {
  // 防御性处理：非数字或无穷大直接返回原值或抛错
  if (!isFinite(num)) {
    return num;
  }
  return Math.round((num + Number.EPSILON) * 100) / 100;
};
