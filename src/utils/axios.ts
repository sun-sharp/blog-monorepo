import { isObject, isString } from '@/utils/is';

const DATE_TIME_FORMAT = 'YYYY-MM-DD HH:mm';

/**
 * @description: 添加参数_t: 时间
 * @param {boolean} join
 * @param {boolean} restful
 * @returns {string | { _t?: number }}
 */
export const joinTimestamp = (join: boolean, restful = false): string | { _t?: number } => {
  if (!join) {
    return restful ? '' : {};
  }
  const now = new Date().getTime();
  if (restful) {
    return `?_t=${now}`;
  }
  return { _t: now };
};

/**
 * @description: 格式化请求参数时间
 * @param {Recordable} params
 */
export const formatRequestDate = (params: Recordable): void => {
  if (Object.prototype.toString.call(params) !== '[object Object]') {
    return;
  }

  for (const key in params) {
    if (params[key] && params[key]._isAMomentObject) {
      params[key] = params[key].format(DATE_TIME_FORMAT);
    }
    if (isString(key)) {
      const value = params[key];
      if (value) {
        try {
          params[key] = isString(value) ? value.trim() : value;
        } catch (error: any) {
          throw new Error(error);
        }
      }
    }
    if (isObject(params[key])) {
      formatRequestDate(params[key]);
    }
  }
};

/**
 * @description: 将对象添加当作参数拼接到URL上面
 * @param {string} baseUrl
 * @param {{ [x: string]: string }} obj
 * @return {string}
 */
export const setObjToUrlParams = (baseUrl: string, obj: { [x: string]: string }): string => {
  let parameters = '';
  let url = '';
  for (const key in obj) {
    parameters += key + '=' + encodeURIComponent(obj[key]) + '&';
  }
  parameters = parameters.replace(/&$/, '');
  if (/\?$/.test(baseUrl)) {
    url = baseUrl + parameters;
  } else {
    url = baseUrl.replace(/\/?$/, '?') + parameters;
  }
  return url;
};
