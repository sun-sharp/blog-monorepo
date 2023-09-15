import { CustomAxios } from './customAxios';
import { APP_ENV_CONFIG } from '@/constant';

const urlPrefix = APP_ENV_CONFIG.urlPrefix || '';

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
    apiUrl: APP_ENV_CONFIG.capitalApiUrl as string,
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
    apiUrl: APP_ENV_CONFIG.blogApiUrl as string,
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
