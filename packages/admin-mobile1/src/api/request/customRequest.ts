import { useUserStore } from '@/store';
import { RESULT_ENUM, PAGE_ENUM } from '@/constant';
import { formatRequestDate, isEmpty, isString, joinTimestamp } from '@shared/utils';
import type { CreateRequestOptions, CustomRequestConfig, RequestOptions, ResponseOptions } from './types';

const showToast = (title: string, icon: 'success' | 'error' | 'none' = 'none') => {
  uni.showToast({ title, icon, duration: 2000 });
};

const checkStatus = (statusCode: number, msg: string): void => {
  switch (statusCode) {
    case 400: showToast(msg || '请求参数有误！', 'error'); break;
    case 401:
      showToast(msg || '用户没有权限！', 'error');
      uni.clearStorageSync();
      uni.reLaunch({ url: PAGE_ENUM.LOGIN_PATH });
      break;
    case 403: showToast(msg || '访问被禁止！', 'error'); break;
    case 404: showToast(msg || '未找到该资源！', 'error'); break;
    case 500: showToast(msg || '服务器错误！', 'error'); break;
    default: showToast(msg, 'error');
  }
};

export class CustomRequest {
  private options: CreateRequestOptions;
  private initRequestOptions: RequestOptions;
  private initResponseOptions: ResponseOptions;
  private requestOptions: RequestOptions = {};
  private responseOptions: ResponseOptions = {};

  constructor(options: CreateRequestOptions) {
    const { requestOptions = {}, responseOptions = {}, ...otherOptions } = options;
    this.options = otherOptions;
    this.initRequestOptions = requestOptions;
    this.initResponseOptions = responseOptions;
  }

  request<T = any>(config: CustomRequestConfig): Promise<T> {
    const { requestOptions, responseOptions, ...otherConfig } = config;
    this.requestOptions = Object.assign({}, this.initRequestOptions, requestOptions);
    this.responseOptions = Object.assign({}, this.initResponseOptions, responseOptions);

    return new Promise<T>((resolve, reject) => {
      const requestConfig = this.processRequestConfig(otherConfig);
      uni.request({
        ...requestConfig,
        success: (res: any) => {
          this.processResponse(res).then(resolve).catch(reject);
        },
        fail: (err: any) => {
          showToast('网络请求失败！', 'error');
          reject(err);
        },
      });
    });
  }

  private processRequestConfig(config: any) {
    const { apiUrl, formatDate, joinTime = true } = this.requestOptions;
    const userStore = useUserStore();
    const completeToken = userStore.getCompleteToken;

    let url: string = config.url || '';
    const headers: Record<string, string> = { 'Content-Type': 'application/json', ...config.headers };

    if (completeToken) headers.Authorization = completeToken;
    if (apiUrl && isString(apiUrl)) url = `${apiUrl}${url}`;

    const params = config.params || {};
    let data = config.data;

    if (!isEmpty(params)) {
      if (formatDate) formatRequestDate(params);
      const timestampParams = joinTimestamp(joinTime, false);
      const queryString = Object.entries({ ...params, ...timestampParams }).map(([key, value]) => `${key}=${value}`).join('&');
      if (queryString) url += `?${queryString}`;
    } else if (data && Object.keys(data).length) {
      data = data;
    } else {
      data = undefined;
    }

    return { url, method: config.method || 'GET', data, header: headers, timeout: this.options.timeout || 60 * 1000, responseType: config.responseType };
  }

  private async processResponse(res: any): Promise<any> {
    const { isShowMessage = true, isShowErrorMessage, isShowSuccessMessage, successMessageText, errorMessageText, errorMessageMode = 'toast', isTransformResponse = true } = this.responseOptions;

    if (res.statusCode !== 200) {
      const msg = res.data?.message || '';
      checkStatus(res.statusCode, msg);
      throw new Error(msg || `请求错误 ${res.statusCode}`);
    }

    const data = res.data;
    if (!isTransformResponse) return data;
    if (!data) { showToast('服务器返回为空！', 'error'); throw new Error('服务器返回为空！'); }

    const { code, result, message } = data;
    const hasSuccess = data && Reflect.has(data, 'code') && code === RESULT_ENUM.SUCCESS;

    if (isShowMessage) {
      if (hasSuccess && (successMessageText || isShowSuccessMessage)) showToast(successMessageText || message || '操作成功！', 'success');
      else if (!hasSuccess && (errorMessageText || isShowErrorMessage)) showToast(message || errorMessageText || '操作失败！', 'error');
      else if (!hasSuccess && errorMessageMode === 'modal') uni.showModal({ title: '提示', content: message || '操作失败！', showCancel: false });
    }

    if (hasSuccess) return result;
    if (data && Reflect.has(data, 'code') && code === RESULT_ENUM.ERROR) { showToast(message || '操作失败,系统异常!', 'error'); throw new Error(message); }
    if (data && Reflect.has(data, 'code') && code === RESULT_ENUM.TIMEOUT) { showToast(message || '登录超时!', 'error'); throw new Error(message); }
    return data;
  }
}
