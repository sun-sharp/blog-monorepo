import { AxiosRequestConfig } from 'axios';

export interface CreateAxiosOptions extends AxiosRequestConfig {
  prefixUrl?: string;
  requestOptions?: RequestOptions;
  responseOptions?: ResponseOptions;
}

export interface CustomAxiosConfig extends AxiosRequestConfig {
  requestOptions?: RequestOptions;
}

export interface CustomAxiosRequest extends AxiosRequestConfig {
  requestOptions?: RequestOptions;
  responseOptions?: ResponseOptions;
}

export interface RequestOptions {
  // 是否加入url
  joinPrefix?: boolean;
  // 格式化请求参数时间
  formatDate?: boolean;
  // 是否添加时间戳
  joinTime?: boolean;
  // 接口地址， 不填则使用默认apiUrl 系统的接口地址
  apiUrl?: string;
}

export interface ResponseOptions {
  // 不进行任何处理，直接返回
  isTransformResponse?: boolean;
  // 是否返回原生响应头
  isReturnNativeResponse?: boolean;
  // 是否显示提示信息
  isShowMessage?: boolean;
  // 是否解析成JSON
  isParseToJson?: boolean;
  // 成功的文本信息
  successMessageText?: string;
  // 是否显示成功信息
  isShowSuccessMessage?: boolean;
  // 是否显示失败信息
  isShowErrorMessage?: boolean;
  // 错误的文本信息
  errorMessageText?: string;
  // 错误消息提示类型
  errorMessageMode?: 'none' | 'dialog';
}

export interface Result<T = any> {
  code: number;
  type?: 'success' | 'error' | 'warning';
  message: string;
  result?: T;
}
