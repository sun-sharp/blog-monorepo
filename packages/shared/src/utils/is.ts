const toString = Object.prototype.toString;

export const is = (val: unknown, type: string) => {
  return toString.call(val) === `[object ${type}]`;
};

export const isFunction = (val: unknown): boolean => {
  return is(val, 'Function');
};

export const isDef = <T = unknown>(val?: T): val is T => {
  return typeof val !== 'undefined';
};

export const isUnDef = <T = unknown>(val?: T): val is T => {
  return !isDef(val);
};

export const isObject = (val: unknown): val is Record<any, any> => {
  return val !== null && is(val, 'Object');
};

export function isDate(val: unknown): boolean {
  return is(val, 'Date');
}

export const isDateFormat = (time: string): boolean => {
  return !isNaN(Date.parse(time));
};

export function isNumber(val: unknown): boolean {
  return typeof val === 'number';
}

export function isAsyncFunction(val: unknown): boolean {
  return is(val, 'AsyncFunction');
}

export function isPromise(val: any): boolean {
  return is(val, 'Promise') && isObject(val) && isFunction(val.then) && isFunction(val.catch);
}

export function isString(val: unknown): val is string {
  return is(val, 'String');
}

export function isBoolean(val: unknown): boolean {
  return typeof val === 'boolean';
}

export function isArray(val: unknown): boolean {
  return typeof val === 'object' && val instanceof Array;
}

export const isClient = (): boolean => {
  return typeof window !== 'undefined';
};

export const isWindow = (val: unknown): boolean => {
  return typeof window !== 'undefined' && is(val, 'Window');
};

export const isElement = (val: any): boolean => {
  return isObject(val) && !!val.tagName;
};

export const isServer = typeof window === 'undefined';

export const isImageDom = (o: Element): boolean => {
  return o && ['IMAGE', 'IMG'].includes(o.tagName);
};

export const isNull = (val: unknown): val is null => {
  return val === null;
};

export const isNullAndUnDef = (val: unknown): boolean => {
  return isUnDef(val) && isNull(val);
};

export const isNullOrUnDef = (val: unknown): boolean => {
  return isUnDef(val) || isNull(val);
};

export const isEmpty = (val: unknown): boolean => {
  return JSON.stringify(val) === '{}' || isUnDef(val) || isNull(val) || val === '';
};

export const isHttpUrl = (val: string): boolean => {
  if (!val) return false;
  return /http(s)?:/.test(val);
};

export const isMobile = (): boolean => {
  if (typeof window === 'undefined') return false;
  const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
  const mobileRegex = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i;
  const isMobileByUA = mobileRegex.test(userAgent.toLowerCase());
  const isMobileByTouch = navigator.maxTouchPoints > 0 && window.innerWidth < 1024;
  return isMobileByUA || isMobileByTouch;
};

export const isJsonString = (str: string): boolean => {
  try {
    return typeof JSON.parse(str) == 'object';
  } catch {
    return false;
  }
};

export const isNumberString = (str: string): boolean => {
  return !isNaN(Number(str));
};
