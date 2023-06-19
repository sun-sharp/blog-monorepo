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

/**
 * @description: 判断值是否未某个类型
 */
export function is(val: unknown, type: string) {
  return toString.call(val) === `[object ${type}]`;
}

/**
 * @description:  是否为字符串
 */
export function isString(val: unknown): val is string {
  return is(val, 'String');
}

/**
 * @description: 已定义
 */
export const isDef = <T = unknown>(val?: T): val is T => {
  return typeof val !== 'undefined';
};

/**
 * @description: 未定义
 */
export const isUnDef = <T = unknown>(val?: T): val is T => {
  return !isDef(val);
};

// 是否为null
export function isNull(val: unknown): val is null {
  return val === null;
}

// 是否为空
export function isEmpty(val: any): val is Record<any, any> | null | undefined | string {
  return JSON.stringify(val) === '{}' || isUnDef(val) || isNull(val) || val === '';
}

/**
 * @description: 是否为对象
 */
export const isObject = (val: any): val is Record<any, any> => {
  return val !== null && is(val, 'Object');
};
