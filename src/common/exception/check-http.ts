import { ApiCode, ApiHttpStatus } from '../enums/api-code.enum';
import { logger } from '../journal';

/**
 * @description 状态码的变化
 * @date 26/11/2021
 * @param {(number)} status
 * @return {*}  {number}
 */
export const checkCode = (status: number): number => {
  let code = null;
  switch (status) {
    case 200:
      code = ApiCode.SUCCESS;
      break;
    case 408:
    case 504:
      code = ApiCode.TIMEOUT;
      break;
  }
  return code === null ? status : code;
};

/**
 * @description 错误状态码的提示
 * @date 26/11/2021
 * @param {(number)} status
 * @param {(string)} msg
 * @return {*}  {string}
 */
export const checkMessage = (status: number, msg: string): string => {
  let message = '';
  switch (status) {
    case ApiHttpStatus.SUCCESS:
      message = msg || '请求成功！';
      break;
    case 400:
      message = msg || '请求参数有误';
      break;
    // 401: 未登录
    // 未登录则跳转登录页面，并携带当前页面的路径
    // 在登录成功后返回当前页面，这一步需要在登录页操作。
    case 401:
      message = msg || '用户没有权限（令牌、用户名、密码错误）!';
      break;
    case 403:
      message = msg || '用户得到授权，但是访问是被禁止的。!';
      break;
    // 404请求不存在
    case 404:
      message = '网络请求错误,未找到该资源!';
      break;
    case 405:
      message = msg || '网络请求错误,请求方法未允许!';
      break;
    case 408:
      message = msg || '网络请求超时!';
      break;
    case 500:
      message = '服务器错误,请联系管理员!';
      break;
    case 501:
      message = msg || '网络未实现!';
      break;
    case 502:
      message = msg || '网络错误!';
      break;
    case 503:
      message = msg || '服务不可用，服务器暂时过载或维护!';
      break;
    case 504:
      message = msg || '网络超时!';
      break;
    case 505:
      message = msg || 'http版本不支持该请求!';
      break;
    default:
      message = msg || '请求失败';
  }
  return message;
};

/**
 * @description: 错误状态码的日志
 * @param {number} status
 * @param {string} method
 * @param {string} url
 * @param {string} msg
 * @return {*}
 */
export const checkHttpLog = (status: number, method: string, url: string, msg: string): any => {
  switch (status) {
    case ApiHttpStatus.SUCCESS:
      logger.log(`success: ${method} ${url} ${msg}`);
      break;
    default:
      logger.error(`error: ${method} ${url} ${msg}`);
      break;
  }
};
