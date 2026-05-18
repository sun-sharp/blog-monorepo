import { useUserStoreWidthOut } from '@/store';
import axios, { AxiosHeaderValue, AxiosInstance, AxiosResponse, HeadersDefaults } from 'axios';
import { formatRequestDate, isEmpty, isString, joinTimestamp } from '@/utils';
import { RESULT_ENUM } from '@/constant';
import { checkStatus } from './checkStatus';
import { VNodeChild } from 'vue';
import { CreateAxiosOptions, CustomAxiosConfig, CustomAxiosRequest, RequestOptions, ResponseOptions } from '/#/common/axios';

const win: WindowConfig = window;

/**
 * @description: 消息弹窗
 * @param {'success' | 'error' | 'warning' | 'info' | 'loading'} type
 * @param {string} msg
 */
export const messageFun = (type: 'success' | 'error' | 'warning' | 'info' | 'loading', msg: string | (() => VNodeChild)) => {
  const { $message: Message } = win;
  // 先关闭以前的消息
  if (Message) {
    Message.destroyAll();
    if (type === 'success') {
      Message.success(msg);
    } else if (type === 'error') {
      Message.error(msg);
    } else if (type === 'warning') {
      Message.warning(msg);
    } else if (type === 'info') {
      Message.info(msg);
    } else if (type === 'loading') {
      Message.loading(msg);
    }
  }
};

/**
 * @description:  axios自定义模块
 */
export class CustomAxios {
  private axiosInstance: AxiosInstance;
  private options: CreateAxiosOptions;
  private initRequestOptions: RequestOptions;
  private initResponseOptions: ResponseOptions;
  private requestOptions: RequestOptions = {};
  private responseOptions: ResponseOptions = {};

  constructor(options: CreateAxiosOptions) {
    const { requestOptions = {}, responseOptions = {}, ...otherOptions } = options;
    this.axiosInstance = axios.create(otherOptions);
    this.options = otherOptions;
    this.initRequestOptions = requestOptions;
    this.initResponseOptions = responseOptions;
    this.setupInterceptors();
  }

  /**
   * @description:  创建axios实例
   */
  private createAxios(options: CreateAxiosOptions): void {
    const { requestOptions = {}, responseOptions = {}, ...otherOptions } = options;
    this.axiosInstance = axios.create(otherOptions);
    this.options = otherOptions;
    this.initRequestOptions = requestOptions;
    this.initResponseOptions = responseOptions;
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
  setHeader(
    headers: HeadersDefaults & {
      [key: string]: AxiosHeaderValue;
    }
  ): void {
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
    const { apiUrl, formatDate, joinTime = true } = this.requestOptions;
    const userStore = useUserStoreWidthOut();
    const completeToken = userStore.getCompleteToken;
    if (completeToken) {
      // jwt token
      conf.headers.Authorization = completeToken;
    }

    // 添加API接口前缀
    if (apiUrl && isString(apiUrl)) {
      conf.url = `${apiUrl}${conf.url}`;
    }

    const params = conf.params || {};
    const data = conf.data || false;
    if (!isEmpty(params)) {
      formatDate && formatRequestDate(params);
      conf.params = Object.assign(params || {}, joinTimestamp(joinTime, false));
    } else if (Reflect.has(conf, 'data') && conf.data && Object.keys(conf.data).length) {
      conf.data = data;
    } else {
      // 兼容restful风格
      conf.params = undefined;
      conf.data = undefined;
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
    const { $dialog: Dialog } = window;
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
      const msg = '服务器返回为空！';
      messageFun('error', msg);
      throw msg;
    }
    //  这里 code，result，message为 后台统一的字段，需要在 types.ts内修改为项目自己的接口返回格式
    const { code, result, message } = data;
    // 请求成功
    const hasSuccess = data && Reflect.has(data, 'code') && code === RESULT_ENUM.SUCCESS;
    // 是否显示提示信息
    if (isShowMessage) {
      if (hasSuccess && (successMessageText || isShowSuccessMessage)) {
        // 是否显示自定义信息提示
        messageFun('success', successMessageText || message || '操作成功！');
      } else if (!hasSuccess && (errorMessageText || isShowErrorMessage)) {
        // 是否显示自定义信息提示
        messageFun('error', message || errorMessageText || '操作失败！');
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
    } else if (message) {
      messageFun('error', message || '请求失败！');
      throw message;
    }

    // 接口请求错误，统一提示错误信息
    const hasError = data && Reflect.has(data, 'code') && code === RESULT_ENUM.ERROR;
    if (hasError) {
      messageFun('error', message || '操作失败,系统异常!');
      throw message;
    }

    // 登录超时
    const hasTimeout = data && Reflect.has(data, 'code') && code === RESULT_ENUM.TIMEOUT;
    if (hasTimeout) {
      messageFun('error', message || '登录超时!');
      throw message;
    }
    return data;
  }

  // 响应结果拦截器错误配置
  private responseInterceptorsCatch(error: any) {
    // @ts-ignore
    const { $dialog: Modal } = window;

    const { response, code, message } = error || {};
    // TODO 此处要根据后端接口返回格式修改
    const msg: string = response && response.data && response.data.message ? response.data.message : '';
    const err: string = error.toString();
    if (code === 'ECONNABORTED' && message.indexOf('timeout') !== -1) {
      messageFun('error', '接口请求超时,请刷新页面重试!');
      throw msg;
    }
    if (err && err.includes('Network Error')) {
      Modal.info({
        title: '网络异常',
        content: '请检查您的网络连接是否正常!',
        positiveText: '确定',
        onPositiveClick: () => {},
      });
      throw msg;
    }
    // 请求是否被取消
    const isCancel = axios.isCancel(error);
    if (!isCancel) {
      checkStatus(response && response.status, msg, messageFun);
    } else {
      console.warn(response, '请求被取消！');
    }
    throw response && response.data ? response.data : response;
  }

  /**
   * @description: 导出功能
   */
  downloadExportFile(config: CustomAxiosConfig, options: { fileName: string }) {
    const { fileName = 'name.xlsx' } = options;
    return new Promise((resolve, reject) => {
      this.request({
        ...config,
        responseType: 'blob', // 设置请求数据格式
      })
        .then((res) => {
          // 将文件流转成blob形式
          const blob = new Blob([res]);
          // 创建一个超链接，将文件流赋进去，然后实现这个超链接的单击事件
          const eLink = document.createElement('a');
          eLink.download = fileName;
          eLink.style.display = 'none';
          eLink.href = URL.createObjectURL(blob);
          document.body.appendChild(eLink);
          eLink.click();
          URL.revokeObjectURL(eLink.href); // 释放URL 对象
          document.body.removeChild(eLink);
          resolve(true);
        })
        .catch(() => {
          reject(false);
        });
    });
  }

  /**
   * @description: axios的request请求
   */
  request<T = any>(config: CustomAxiosRequest): Promise<T> {
    const { requestOptions, responseOptions, ...otherConfig } = config;
    const conf: CustomAxiosConfig = Object.assign({}, this.options, otherConfig);
    this.requestOptions = Object.assign({}, this.initRequestOptions, requestOptions);
    this.responseOptions = Object.assign({}, this.initResponseOptions, responseOptions);
    return this.axiosInstance.request(conf);
  }
}
