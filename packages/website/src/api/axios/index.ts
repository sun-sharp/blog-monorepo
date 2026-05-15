import { CustomAxios } from './customAxios';
import { VITE_API_URL_PREFIX, VITE_BLOG_API_URL, VITE_CAPITAL_API_URL } from '@/constants';

const urlPrefix = VITE_API_URL_PREFIX || '';

export const AxiosCapital = new CustomAxios({
  timeout: 60 * 1000,
  // 接口前缀
  prefixUrl: urlPrefix,
  withCredentials: false,
  // 配置项，下面的选项都可以在独立的接口请求中覆盖
  requestOptions: {
    // 默认将prefix 添加到url
    joinPrefix: true,
    // 格式化提交参数时间
    formatDate: true,
    // 接口地址
    apiUrl: VITE_CAPITAL_API_URL,
  },
  responseOptions: {
    // 需要对返回数据进行处理
    isTransformResponse: true,
    // 是否返回原生响应头 比如：需要获取响应头时使用该属性
    isReturnNativeResponse: false,
    // 消息提示类型
    errorMessageMode: 'none',
  },
});

export const AxiosBlog = new CustomAxios({
  timeout: 60 * 1000,
  // 接口前缀
  prefixUrl: urlPrefix,
  withCredentials: false,
  // 配置项，下面的选项都可以在独立的接口请求中覆盖
  requestOptions: {
    // 默认将prefix 添加到url
    joinPrefix: true,
    // 格式化提交参数时间
    formatDate: true,
    // 接口地址
    apiUrl: VITE_BLOG_API_URL,
  },
  responseOptions: {
    // 需要对返回数据进行处理
    isTransformResponse: true,
    // 是否返回原生响应头 比如：需要获取响应头时使用该属性
    isReturnNativeResponse: false,
    // 消息提示类型
    errorMessageMode: 'none',
  },
});
