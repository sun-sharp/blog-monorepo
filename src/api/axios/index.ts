import { getAppEnvConfig } from '@/utils';
import { CustomAxios } from './customAxios';

const appEnvConfig = getAppEnvConfig();
const urlPrefix = appEnvConfig.urlPrefix || '';

export const AxiosMock = new CustomAxios({
  timeout: 10 * 1000,
  // 接口前缀
  prefixUrl: urlPrefix,
  // 配置项，下面的选项都可以在独立的接口请求中覆盖
  requestOptions: {
    // 默认将prefix 添加到url
    joinPrefix: true,
    // 是否返回原生响应头 比如：需要获取响应头时使用该属性
    isReturnNativeResponse: false,
    // 需要对返回数据进行处理
    isTransformResponse: true,
    // post请求的时候添加参数到url
    joinParamsToUrl: false,
    // 格式化提交参数时间
    formatDate: true,
    // 消息提示类型
    errorMessageMode: 'none',
    // 接口地址
    mockApiUrl: appEnvConfig.mockApiUrl as string,
  },
  withCredentials: false,
});

export const AxiosCapital = new CustomAxios({
  timeout: 10 * 1000,
  // 接口前缀
  prefixUrl: urlPrefix,
  // 配置项，下面的选项都可以在独立的接口请求中覆盖
  requestOptions: {
    // 默认将prefix 添加到url
    joinPrefix: true,
    // 是否返回原生响应头 比如：需要获取响应头时使用该属性
    isReturnNativeResponse: false,
    // 需要对返回数据进行处理
    isTransformResponse: true,
    // post请求的时候添加参数到url
    joinParamsToUrl: false,
    // 格式化提交参数时间
    formatDate: true,
    // 消息提示类型
    errorMessageMode: 'none',
    // 接口地址
    capitalApiUrl: appEnvConfig.capitalApiUrl as string,
  },
  withCredentials: false,
});

export const AxiosBlog = new CustomAxios({
  timeout: 10 * 1000,
  // 接口前缀
  prefixUrl: urlPrefix,
  // 配置项，下面的选项都可以在独立的接口请求中覆盖
  requestOptions: {
    // 默认将prefix 添加到url
    joinPrefix: true,
    // 是否返回原生响应头 比如：需要获取响应头时使用该属性
    isReturnNativeResponse: false,
    // 需要对返回数据进行处理
    isTransformResponse: true,
    // post请求的时候添加参数到url
    joinParamsToUrl: false,
    // 格式化提交参数时间
    formatDate: true,
    // 消息提示类型
    errorMessageMode: 'none',
    // 接口地址
    blogApiUrl: appEnvConfig.blogApiUrl as string,
  },
  withCredentials: false,
});

export const AxiosFile = new CustomAxios({
  timeout: 10 * 1000,
  // 接口前缀
  prefixUrl: urlPrefix,
  // 配置项，下面的选项都可以在独立的接口请求中覆盖
  requestOptions: {
    // 默认将prefix 添加到url
    joinPrefix: true,
    // 是否返回原生响应头 比如：需要获取响应头时使用该属性
    isReturnNativeResponse: false,
    // 需要对返回数据进行处理
    isTransformResponse: true,
    // post请求的时候添加参数到url
    joinParamsToUrl: false,
    // 格式化提交参数时间
    formatDate: true,
    // 消息提示类型
    errorMessageMode: 'none',
    // 接口地址
    fileApiUrl: appEnvConfig.fileApiUrl as string,
  },
  withCredentials: false,
});
