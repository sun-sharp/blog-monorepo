import { isObject, isString } from '@/utils/is';

const DATE_TIME_FORMAT = 'YYYY-MM-DD HH:mm';

// 添加参数_t: 时间
export const joinTimestamp = (join: boolean, restful = false): string | object => {
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
 */
export const formatRequestDate = (params: Recordable) => {
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
        } catch (error: unknown) {
          console.error('Failed to trim value:', error);
          throw error;
        }
      }
    }
    if (isObject(params[key])) {
      formatRequestDate(params[key]);
    }
  }
};

/**
 * 将对象添加当作参数拼接到URL上面
 * @param baseUrl 需要拼接的url
 * @param obj 参数对象
 * @returns {string} 拼接后的对象
 * 例子:
 *  let obj = {a: '3', b: '4'}
 *  setObjToUrlParams('www.baidu.com', obj)
 *  ==>www.baidu.com?a=3&b=4
 */
export const setObjToUrlParams = (baseUrl: string, obj: { [x: string]: string }): string => {
  let parameters = '';
  for (const key in obj) {
    parameters += key + '=' + encodeURIComponent(obj[key]) + '&';
  }
  parameters = parameters.replace(/&$/, '');
  if (/\?$/.test(baseUrl)) {
    return baseUrl + parameters;
  }
  return baseUrl.replace(/\/?$/, '?') + parameters;
};
