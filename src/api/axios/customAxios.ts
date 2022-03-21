import { useUserStoreWidthOut } from '@/store';
import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { CreateAxiosOptions, CustomAxiosConfig, CustomAxiosRequest, RequestOptions, ResponseOptions } from '/#/axios';
import { formatRequestDate, getAppEnvConfig, isString, joinTimestamp, setObjToUrlParams } from '@/utils';
import { RequestEnum, ResultEnum } from '@/constant';
import { checkStatus } from './checkStatus';

const appEnvConfig = getAppEnvConfig();
const urlPrefix = appEnvConfig.urlPrefix || '';

/**
 * @description:  axios自定义模块
 */
export class CustomAxios {
  private axiosInstance: AxiosInstance;
  private options: CreateAxiosOptions;
  private requestOptions: RequestOptions;
  private responseOptions: ResponseOptions;

  constructor(options: CreateAxiosOptions) {
    const { requestOptions = {}, responseOptions = {}, ...otherOptions } = options;
    this.axiosInstance = axios.create(otherOptions);
    this.options = otherOptions;
    this.requestOptions = requestOptions;
    this.responseOptions = responseOptions;
    this.setupInterceptors();
  }

  /**
   * @description:  创建axios实例
   */
  private createAxios(options: CreateAxiosOptions): void {
    const { requestOptions = {}, responseOptions = {}, ...otherOptions } = options;
    this.axiosInstance = axios.create(otherOptions);
    this.options = otherOptions;
    this.requestOptions = requestOptions;
    this.responseOptions = responseOptions;
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
  configAxios(options: CreateAxiosOptions) {
    if (!this.axiosInstance) {
      return;
    }
    this.createAxios(options);
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
    const self = this;
    // 请求拦截器捕获
    self.axiosInstance.interceptors.request.use(
      (config) => self.requestInterceptors(config),
      (error) => self.requestInterceptorsCatch(error)
    );

    // 响应结果拦截器处理
    self.axiosInstance.interceptors.response.use(
      (res) => self.responseInterceptors(res),
      (error) => self.responseInterceptorsCatch(error)
    );
  }

  // 请求拦截器配置
  private requestInterceptors(config: CustomAxiosConfig) {
    // 请求之前处理config
    const conf: any = Object.assign({}, config);
    const { apiUrl, joinPrefix, joinParamsToUrl, formatDate, joinTime = true } = this.requestOptions;
    const userStore = useUserStoreWidthOut();
    const token = userStore.getToken;
    if (token) {
      const tokenHead = getAppEnvConfig().tokenHead;
      // jwt token
      conf.headers.Authorization = tokenHead ? tokenHead + token : token;
    }

    // 添加接口前缀
    if (joinPrefix) {
      conf.url = `${urlPrefix}${conf.url}`;
    }

    // 添加API接口前缀
    if (apiUrl && isString(apiUrl)) {
      conf.url = `${apiUrl}${conf.url}`;
    }

    const params = conf.params || {};
    const data = conf.data || false;
    if (conf.method?.toUpperCase() === RequestEnum.GET) {
      if (!isString(params)) {
        // 给 get 请求加上时间戳参数，避免从缓存中拿数据。
        conf.params = Object.assign(params || {}, joinTimestamp(joinTime, false));
      } else {
        // 兼容restful风格
        conf.url = conf.url + params + `${joinTimestamp(joinTime, true)}`;
        conf.params = undefined;
      }
    } else {
      if (!isString(params)) {
        formatDate && formatRequestDate(params);
        if (Reflect.has(conf, 'data') && conf.data && Object.keys(conf.data).length) {
          conf.data = data;
          conf.params = params;
        } else {
          conf.data = params;
          conf.params = undefined;
        }
        if (joinParamsToUrl) {
          conf.url = setObjToUrlParams(conf.url as string, Object.assign({}, conf.params, conf.data));
        }
      } else {
        // 兼容restful风格
        conf.url = conf.url + params;
        conf.params = undefined;
      }
    }

    return conf;
  }

  // 请求拦截器错误配置
  private requestInterceptorsCatch(error: any) {
    return error;
  }

  // 响应结果拦截器配置
  private responseInterceptors(res: AxiosResponse<any>) {
    // @ts-ignore
    const { $message: Message, $dialog: Dialog } = window;
    const {
      isShowMessage = true, // 是否显示提示信息
      isShowErrorMessage, // 是否显示错误信息
      isShowSuccessMessage, // 是否显示成功信息
      successMessageText, // 成功信息文本
      errorMessageText, // 错误信息文本
      errorMessageMode,
      isTransformResponse, // 不进行任何处理，直接返回 res.data
      isReturnNativeResponse, // 返回原生响应头
    } = this.responseOptions;
    // 是否返回原生响应头 比如：需要获取响应头时使用该属性
    if (isReturnNativeResponse) {
      return res;
    }
    // 不进行任何处理，直接返回
    // 用于页面代码可能需要直接获取code，data，message这些信息时开启
    if (!isTransformResponse) {
      return res.data;
    }

    const { data } = res;

    if (!data) {
      return Promise.reject(data);
    }
    //  这里 code，result，message为 后台统一的字段，需要在 types.ts内修改为项目自己的接口返回格式
    const { code, result, message } = data;
    // 请求成功
    const hasSuccess = data && Reflect.has(data, 'code') && code === ResultEnum.SUCCESS;
    // 是否显示提示信息
    if (isShowMessage) {
      if (hasSuccess && (successMessageText || isShowSuccessMessage)) {
        // 是否显示自定义信息提示
        Message.success(successMessageText || message || '操作成功！');
      } else if (!hasSuccess && (errorMessageText || isShowErrorMessage)) {
        // 是否显示自定义信息提示
        Message.error(message || errorMessageText || '操作失败！');
      } else if (!hasSuccess && errorMessageMode === 'dialog') {
        // errorMessageMode=‘dialog’的时候会显示dialog错误弹窗，而不是消息提示，用于一些比较重要的错误
        Dialog.info({
          title: '提示',
          content: message,
          positiveText: '确定',
          onPositiveClick: () => {},
        });
      }
    }
    // 接口请求成功，直接返回结果
    if (hasSuccess) {
      return result;
    }

    // 接口请求错误，统一提示错误信息
    const hasError = data && Reflect.has(data, 'code') && code === ResultEnum.ERROR;
    if (hasError) {
      Message.error(message || '操作失败,系统异常!');
      return Promise.reject(new Error(message));
    }

    // 登录超时
    const hasTimeout = data && Reflect.has(data, 'code') && code === ResultEnum.TIMEOUT;
    if (hasTimeout) {
      Message.error(message || '登录超时!');
      return Promise.reject(new Error(message));
    }

    // 这里逻辑可以根据项目进行修改
    if (!hasSuccess) {
      return Promise.reject(new Error(message));
    }
    return data;
  }

  // 响应结果拦截器错误配置
  private responseInterceptorsCatch(error: any) {
    // @ts-ignore
    const { $message: Message, $dialog: Modal } = window;
    const { response, code, message } = error || {};
    // TODO 此处要根据后端接口返回格式修改
    const msg: string = response && response.data && response.data.message ? response.data.message : '';
    const err: string = error.toString();
    if (code === 'ECONNABORTED' && message.indexOf('timeout') !== -1) {
      Message.error('接口请求超时,请刷新页面重试!');
      return Promise.reject(new Error(msg));
    }
    if (err && err.includes('Network Error')) {
      Modal.info({
        title: '网络异常',
        content: '请检查您的网络连接是否正常!',
        positiveText: '确定',
        onPositiveClick: () => {},
      });
      return Promise.reject(new Error(msg));
    }
    // 请求是否被取消
    const isCancel = axios.isCancel(error);
    if (!isCancel) {
      checkStatus(error.response && error.response.status, msg, Message);
    } else {
      console.warn(error, '请求被取消！');
    }
    return Promise.reject(new Error(msg));
  }

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
  request<T = any>(config: CustomAxiosRequest): Promise<T> {
    const { requestOptions, responseOptions, ...otherConfig } = config;
    const conf: CustomAxiosConfig = Object.assign({}, this.options, otherConfig);
    this.requestOptions = Object.assign({}, this.requestOptions, requestOptions);
    this.responseOptions = Object.assign({}, this.responseOptions, responseOptions);
    return this.axiosInstance.request(conf);
  }
}
