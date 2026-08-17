import { getToken } from './auth';
import { ResultEnum } from '../../shared/src/constants/http-enum';
import { ApiResponse } from '/#/api/common';
import { loading } from './loading';

interface RequestConfig {
  url: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  data?: any;
  params?: any;
  header?: Record<string, string>;
  baseUrl?: string;
  isTransformResponse?: boolean;
  isShowSuccessMessage?: boolean;
  showLoading?: boolean;
  loadingText?: string;
  timeout?: number;
}

const BASE_URL = import.meta.env.VITE_BASE_URL || '';
const CAPITAL_API_URL = import.meta.env.VITE_CAPITAL_API_URL || '';
const BLOG_API_URL = import.meta.env.VITE_BLOG_API_URL || '';
const BACKUP_API_URL = import.meta.env.VITE_BACKUP_API_URL || '';
const PM2_LOG_API_URL = import.meta.env.VITE_PM2_LOG_API_URL || '';
const AUTHORIZATION_HEAD = import.meta.env.VITE_AUTHORIZATION_HEAD || 'Bearer ';

export function isH5Platform(): boolean {
  try {
    return uni.getSystemInfoSync().uniPlatform === 'web';
  } catch {
    return false;
  }
}

const CAPITAL_BASE = isH5Platform() ? CAPITAL_API_URL : `${BASE_URL}${CAPITAL_API_URL}`;
const BLOG_BASE = isH5Platform() ? BLOG_API_URL : `${BASE_URL}${BLOG_API_URL}`;
const BACKUP_BASE = isH5Platform() ? BACKUP_API_URL : `${BASE_URL}${BACKUP_API_URL}`;
const PM2_LOG_BASE = isH5Platform() ? PM2_LOG_API_URL : `${BASE_URL}${PM2_LOG_API_URL}`;

function buildUrl(config: RequestConfig): string {
  let url = config.url;
  const baseUrl = config.baseUrl || BASE_URL;
  const fullUrl = `${baseUrl}${url}`;

  if (config.params) {
    const params = new URLSearchParams();
    Object.keys(config.params).forEach((key) => {
      const value = config.params[key];
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value);
      }
    });
    const queryString = params.toString();
    if (queryString) {
      return `${fullUrl}${fullUrl.includes('?') ? '&' : '?'}${queryString}`;
    }
  }

  return fullUrl;
}

function request<T = any>(config: RequestConfig): Promise<T> {
  const needLoading = config.showLoading !== false;
  if (needLoading) {
    loading.show(config.loadingText);
  }

  return new Promise((resolve, reject) => {
    const token = getToken();
    const header: Record<string, string> = {
      'Content-Type': 'application/json;charset=UTF-8',
      ...config.header,
    };

    if (token) {
      header['Authorization'] = AUTHORIZATION_HEAD + token;
    }

    uni.request({
      url: buildUrl(config),
      method: config.method || 'GET',
      data: config.data,
      header,
      timeout: config.timeout || 30000,
      success: (res) => {
        const statusCode = res.statusCode;
        if (statusCode === 200) {
          const responseData = res.data as ApiResponse<T>;
          const isTransform = config.isTransformResponse !== false;

          if (isTransform && responseData.code !== undefined) {
            if (responseData.code === ResultEnum.SUCCESS) {
              if (config.isShowSuccessMessage && responseData.message) {
                uni.showToast({ title: String(responseData.message), icon: 'success' });
              }
              resolve(responseData.result as T);
            } else {
              const errorMsg = typeof responseData.message === 'string' ? responseData.message : '请求失败';
              uni.showToast({ title: errorMsg, icon: 'none' });
              reject(new Error(errorMsg));
            }
          } else {
            resolve(res.data as T);
          }
        } else if (statusCode === 401) {
          uni.showToast({ title: '登录已过期，请重新登录', icon: 'none' });
          setTimeout(() => {
            uni.reLaunch({ url: '/pages/login/login' });
          }, 1500);
          reject(new Error('未授权'));
        } else {
          uni.showToast({ title: `请求错误(${statusCode})`, icon: 'none' });
          reject(new Error(`请求错误: ${statusCode}`));
        }
      },
      fail: (err: any) => {
        let errMsg = '网络请求失败';
        if (err?.errMsg?.includes('timeout')) {
          errMsg = '请求超时，请稍后重试';
        } else if (err?.errMsg) {
          errMsg = err.errMsg;
        }
        uni.showToast({ title: errMsg, icon: 'none' });
        reject(new Error(errMsg));
      },
    });
  }).finally(() => {
    if (needLoading) {
      return loading.hide();
    }
  }) as Promise<T>;
}

export function createRequest(baseUrl: string) {
  return <T = any>(config: Omit<RequestConfig, 'baseUrl'>): Promise<T> => {
    return request<T>({ ...config, baseUrl });
  };
}

export const capitalRequest = createRequest(CAPITAL_BASE);
export const blogRequest = createRequest(BLOG_BASE);
export const backupRequest = createRequest(BACKUP_BASE);
export const pm2LogRequest = createRequest(PM2_LOG_BASE);

export const uploadFileRequest = <T = any>(filePath: string): Promise<T> => {
  const urlPrefix = isH5Platform() ? BLOG_API_URL : `${BASE_URL}${BLOG_API_URL}`;
  return new Promise((resolve, reject) => {
    const token = getToken();
    const header: Record<string, string> = {};

    if (token) {
      header['Authorization'] = AUTHORIZATION_HEAD + token;
    }
    console.log(header, 'header');

    uni.uploadFile({
      url: `${urlPrefix}/article/upload_md`,
      filePath,
      name: 'file',
      header,
      success: (res) => {
        try {
          const data = JSON.parse(res.data);
          if (data.code === 0) resolve(data.result as T);
          else reject(new Error(data.message || '解析失败'));
        } catch {
          reject(new Error('解析响应失败'));
        }
      },
      fail: (err) => reject(err),
    });
  });
};

export const blogReqUrl = (url: string) => {
  return `${BASE_URL}${BLOG_API_URL}${url}`;
};

export default request;
