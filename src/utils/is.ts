const toString = Object.prototype.toString;

/**
 * @description: 判断值是否未某个类型
 */
export const is = (val: unknown, type: string) => {
  return toString.call(val) === `[object ${type}]`;
};

/**
 * @description:  是否为函数
 */
export const isFunction = (val: unknown): boolean => {
  return is(val, 'Function');
};

/**
 * @description: 已定义
 */
export const isDef = (val?: unknown): boolean => {
  return typeof val !== 'undefined';
};

/**
 * @description: 未定义
 */
export const isUnDef = (val?: unknown): boolean => {
  return !isDef(val);
};
/**
 * @description: 是否为对象
 */
export const isObject = (val: unknown): boolean => {
  return val !== null && is(val, 'Object');
};

/**
 * @description:  是否为时间
 */
export function isDate(val: unknown): boolean {
  return is(val, 'Date');
}

/**
 * @description: 判断是否为日期格式
 * @param {string} time
 * @return {boolean}
 */
export const isDateFormat = (time: string): boolean => {
  return !isNaN(Date.parse(time));
};

/**
 * @description:  是否为数值
 */
export function isNumber(val: unknown): boolean {
  return typeof val === 'number';
}

/**
 * @description:  是否为AsyncFunction
 */
export function isAsyncFunction(val: unknown): boolean {
  return is(val, 'AsyncFunction');
}

/**
 * @description:  是否为promise
 */
export function isPromise(val: any): boolean {
  return is(val, 'Promise') && isObject(val) && isFunction(val.then) && isFunction(val.catch);
}

/**
 * @description:  是否为字符串
 */
export function isString(val: unknown): boolean {
  return typeof val === 'string';
}

/**
 * @description:  是否为boolean类型
 */
export function isBoolean(val: unknown): boolean {
  return typeof val === 'boolean';
}

/**
 * @description:  是否为数组
 */
export function isArray(val: unknown): boolean {
  return typeof val === 'object' && val instanceof Array;
}

/**
 * @description: 是否客户端
 */
export const isClient = (): boolean => {
  return typeof window !== 'undefined';
};

/**
 * @description: 是否为浏览器
 */
export const isWindow = (val: unknown): boolean => {
  return typeof window !== 'undefined' && is(val, 'Window');
};

// 是否为html dom节点
export const isElement = (val: any): boolean => {
  return isObject(val) && !!val.tagName;
};

// 判断window是否未定义
export const isServer = typeof window === 'undefined';

// 是否为图片节点
export const isImageDom = (o: Element): boolean => {
  return o && ['IMAGE', 'IMG'].includes(o.tagName);
};

// 是否为null
export const isNull = (val: unknown): boolean => {
  return val === null;
};

// 是否为null 和 未定义undefined
export const isNullAndUnDef = (val: unknown): boolean => {
  return isUnDef(val) && isNull(val);
};

// 是否为null 或 未定义undefined
export const isNullOrUnDef = (val: unknown): boolean => {
  return isUnDef(val) || isNull(val);
};

// 是否为空
export const isEmpty = (val: unknown): boolean => {
  return JSON.stringify(val) === '{}' || isUnDef(val) || isNull(val) || val === '';
};
