import { useUserStoreWidthOut } from '@/store';
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { CreateAxiosOptions, RequestOptions, Result } from '/#/axios';
import { cloneDeep } from 'lodash-es';
import { formatRequestDate, getAppEnvConfig, isString, joinTimestamp, setObjToUrlParams, storage } from '@/utils';
import { PageEnum, RequestEnum, ResultEnum } from '@/constant';
import router from '@/router';
import { checkStatus } from './checkStatus';

const appEnvConfig = getAppEnvConfig();
const urlPrefix = appEnvConfig.urlPrefix || '';

/**
 * @description:  axios自定义模块
 */
export class CustomAxios {
  private axiosInstance: AxiosInstance;
  private options: CreateAxiosOptions;

  constructor(options: CreateAxiosOptions) {
    this.options = options;
    this.axiosInstance = axios.create(options);
    this.setupInterceptors();
  }

  /**
   * @description:  创建axios实例
   */
  private createAxios(config: CreateAxiosOptions): void {
    this.axiosInstance = axios.create(config);
  }

  /**
   * @description:  获取axios实例
   */
  getAxios(): AxiosInstance {
    return this.axiosInstance;
  }

  /**
   * @description: 重新配置axios
   */
  configAxios(config: CreateAxiosOptions) {
    if (!this.axiosInstance) {
      return;
    }
    this.createAxios(config);
  }

  /**
   * @description: 设置通用header
   */
  setHeader(headers: any): void {
    if (!this.axiosInstance) {
      return;
    }
    Object.assign(this.axiosInstance.defaults.headers, headers);
  }

  /**
   * @description: 拦截器配置
   */
  private setupInterceptors() {
    // 请求拦截器捕获
    this.axiosInstance.interceptors.request.use(this.requestInterceptors, this.requestInterceptorsCatch);

    // 响应结果拦截器处理
    this.axiosInstance.interceptors.response.use(this.responseInterceptors, this.responseInterceptorsCatch);
  }

  // 请求拦截器配置
  private requestInterceptors(config: AxiosRequestConfig) {
    // 请求之前处理config
    const { requestOption, ...conf }: any = Object.assign({}, config);
    console.log(requestOption);
    const userStore = useUserStoreWidthOut();
    const token = userStore.getToken;
    if (token) {
      const tokenHead = getAppEnvConfig().tokenHead;
      // jwt token
      conf.headers.Authorization = tokenHead ? tokenHead + token : token;
    }
    return conf;
  }

  // 请求拦截器错误配置
  private requestInterceptorsCatch(error: any) {
    return error;
  }

  // 响应结果拦截器配置
  private responseInterceptors(res: AxiosResponse<any>) {
    return res;
  }

  // 响应结果拦截器错误配置
  private responseInterceptorsCatch(error: any) {
    // @ts-ignore
    // const { $message: Message, $dialog: Modal } = window;
    // const { response, code, message } = error || {};
    // // TODO 此处要根据后端接口返回格式修改
    // const msg: string = response && response.data && response.data.message ? response.data.message : '';
    // const err: string = error.toString();
    // try {
    //   if (code === 'ECONNABORTED' && message.indexOf('timeout') !== -1) {
    //     Message.error('接口请求超时,请刷新页面重试!');
    //     return;
    //   }
    //   if (err && err.includes('Network Error')) {
    //     Modal.info({
    //       title: '网络异常',
    //       content: '请检查您的网络连接是否正常!',
    //       positiveText: '确定',
    //       onPositiveClick: () => {},
    //     });
    //     return;
    //   }
    // } catch (error: any) {
    //   throw new Error(error);
    // }
    // // 请求是否被取消
    // const isCancel = axios.isCancel(error);
    // if (!isCancel) {
    //   checkStatus(error.response && error.response.status, msg, Message);
    // } else {
    //   console.warn(error, '请求被取消！');
    // }
    return error;
  }

  // 请求之前处理config
  /* private beforeRequestHook(config: AxiosRequestConfig, options: RequestOptions) {
    const { capitalApiUrl, blogApiUrl, mockApiUrl, fileApiUrl, joinPrefix, joinParamsToUrl, formatDate, joinTime = true } = options;

    // 添加接口前缀
    if (joinPrefix) {
      config.url = `${urlPrefix}${config.url}`;
    }

    // 添加capital API接口前缀
    if (capitalApiUrl && isString(capitalApiUrl)) {
      config.url = `${capitalApiUrl}${config.url}`;
    }

    // 添加blog API接口前缀
    if (blogApiUrl && isString(blogApiUrl)) {
      config.url = `${blogApiUrl}${config.url}`;
    }

    // 添加mock API接口前缀
    if (mockApiUrl && isString(mockApiUrl)) {
      config.url = `${mockApiUrl}${config.url}`;
    }

    // 添加file API接口前缀
    if (fileApiUrl && isString(fileApiUrl)) {
      config.url = `${fileApiUrl}${config.url}`;
    }

    const params = config.params || {};
    const data = config.data || false;
    if (config.method?.toUpperCase() === RequestEnum.GET) {
      if (!isString(params)) {
        // 给 get 请求加上时间戳参数，避免从缓存中拿数据。
        config.params = Object.assign(params || {}, joinTimestamp(joinTime, false));
      } else {
        // 兼容restful风格
        config.url = config.url + params + `${joinTimestamp(joinTime, true)}`;
        config.params = undefined;
      }
    } else {
      if (!isString(params)) {
        formatDate && formatRequestDate(params);
        if (Reflect.has(config, 'data') && config.data && Object.keys(config.data).length) {
          config.data = data;
          config.params = params;
        } else {
          config.data = params;
          config.params = undefined;
        }
        if (joinParamsToUrl) {
          config.url = setObjToUrlParams(config.url as string, Object.assign({}, config.params, config.data));
        }
      } else {
        // 兼容restful风格
        config.url = config.url + params;
        config.params = undefined;
      }
    }
    return config;
  } */

  /**
   * @description: 处理请求数据
   */
  /* private transformRequestData(res: AxiosResponse<Result>, options: RequestOptions) {
    console.log(res, options);

    // @ts-ignore
    const { $message: Message, $dialog: Dialog } = window;
    const {
      isShowMessage = true, // 是否显示提示信息
      isShowErrorMessage, // 是否显示错误信息
      isShowSuccessMessage, // 是否显示成功信息
      successMessageText, // 成功信息文本
      errorMessageText, // 错误信息文本
      isTransformResponse, // 不进行任何处理，直接返回 res.data
      isReturnNativeResponse, // 返回原生响应头
    } = options;
    // 是否返回原生响应头 比如：需要获取响应头时使用该属性
    if (isReturnNativeResponse) {
      return res;
    }
    // 不进行任何处理，直接返回
    // 用于页面代码可能需要直接获取code，data，message这些信息时开启
    if (!isTransformResponse) {
      return res.data;
    }
    // const reject = Promise.reject;
    // const { data } = res;
    // if (!data) {
    //   // return '[HTTP] Request has no return value';
    //   return data;
    // }
    // //  这里 code，result，message为 后台统一的字段，需要在 types.ts内修改为项目自己的接口返回格式
    // const { code, result, message } = data;
    // // 请求成功
    // const hasSuccess = data && Reflect.has(data, 'code') && code === ResultEnum.SUCCESS;
    // // 是否显示提示信息
    // if (isShowMessage) {
    //   if (hasSuccess && (successMessageText || isShowSuccessMessage)) {
    //     // 是否显示自定义信息提示
    //     Message.success(successMessageText || message || '操作成功！');
    //   } else if (!hasSuccess && (errorMessageText || isShowErrorMessage)) {
    //     // 是否显示自定义信息提示
    //     Message.error(message || errorMessageText || '操作失败！');
    //   } else if (!hasSuccess && options.errorMessageMode === 'dialog') {
    //     // errorMessageMode=‘dialog’的时候会显示dialog错误弹窗，而不是消息提示，用于一些比较重要的错误
    //     Dialog.info({
    //       title: '提示',
    //       content: message,
    //       positiveText: '确定',
    //       onPositiveClick: () => {},
    //     });
    //   }
    // }
    // // 接口请求成功，直接返回结果
    // if (hasSuccess) {
    //   return result;
    // }
    // // 接口请求错误，统一提示错误信息
    // const hasError = data && Reflect.has(data, 'code') && code === ResultEnum.ERROR;
    // if (hasError) {
    //   if (message) {
    //     Message.error(message);
    //     Promise.reject(message);
    //   } else {
    //     const msg = '操作失败,系统异常!';
    //     Message.error(msg);
    //     Promise.reject(msg);
    //   }
    //   return reject();
    // }
    // // 登录超时
    // const hasTimeout = data && Reflect.has(data, 'code') && code === ResultEnum.TIMEOUT;
    // if (hasTimeout) {
    //   const LoginName = PageEnum.LOGIN_NAME;
    //   if (router.currentRoute.value.name == LoginName) return;
    //   // 到登录页
    //   const timeoutMsg = '登录超时,请重新登录!';
    //   Dialog.warning({
    //     title: '提示',
    //     content: '登录身份已失效，请重新登录!',
    //     positiveText: '确定',
    //     negativeText: '取消',
    //     onPositiveClick: () => {
    //       storage.clear();
    //       router.replace({
    //         name: LoginName,
    //         query: {
    //           redirect: router.currentRoute.value.fullPath,
    //         },
    //       });
    //     },
    //     onNegativeClick: () => {},
    //   });
    //   return reject(timeoutMsg);
    // }
    // // 这里逻辑可以根据项目进行修改
    // if (!hasSuccess) {
    //   return reject(message);
    // }
    // return data;
  } */

  /**
   * @description: axios的request请求
   */
  request(config: AxiosRequestConfig) {
    return this.axiosInstance.request(config);
  }
}
