import { useUserStoreWidthOut } from '@/store';
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { CreateAxiosOptions, RequestOptions, Result } from '/#/axios';
import { cloneDeep } from 'lodash-es';

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
    // 请求拦截器错误捕获
    this.axiosInstance.interceptors.request.use(this.requestInterceptors, this.requestInterceptorsCatch);

    // 响应结果拦截器处理
    this.axiosInstance.interceptors.response.use(this.responseInterceptors, this.responseInterceptorsCatch);
  }

  // 请求拦截器配置
  private requestInterceptors(config: AxiosRequestConfig) {
    debugger;
    // 请求之前处理config
    const newConfig: any = Object.assign({}, config);
    const userStore = useUserStoreWidthOut();
    const token = userStore.getToken;
    if (token) {
      const token_head = import.meta.env.VITE_AUTHORIZATION_HEAD;
      // jwt token
      newConfig.headers.Authorization = token_head ? token_head + token : token;
    }
    return newConfig;
  }

  // 请求拦截器错误配置
  private requestInterceptorsCatch(error: any) {
    debugger;
    return error;
  }

  // 响应结果拦截器配置
  private responseInterceptors(res: AxiosResponse<any>) {
    debugger;
    console.log(res);
    return res;
  }

  // 响应结果拦截器错误配置
  private responseInterceptorsCatch(error: any) {
    debugger;
    return error;
  }

  // 请求之前处理config
  beforeRequestHook(config, options) {
    // const { capitalApiUrl, blogApiUrl, mockApiUrl, fileApiUrl, joinPrefix, joinParamsToUrl, formatDate, joinTime = true } = options;

    // // 添加接口前缀
    // if (joinPrefix) {
    //   config.url = `${urlPrefix}${config.url}`;
    // }

    // // 添加capital API接口前缀
    // if (capitalApiUrl && isString(capitalApiUrl)) {
    //   config.url = `${capitalApiUrl}${config.url}`;
    // }

    // // 添加blog API接口前缀
    // if (blogApiUrl && isString(blogApiUrl)) {
    //   config.url = `${blogApiUrl}${config.url}`;
    // }

    // // 添加mock API接口前缀
    // if (mockApiUrl && isString(mockApiUrl)) {
    //   config.url = `${mockApiUrl}${config.url}`;
    // }

    // // 添加file API接口前缀
    // if (fileApiUrl && isString(fileApiUrl)) {
    //   config.url = `${fileApiUrl}${config.url}`;
    // }

    // const params = config.params || {};
    // const data = config.data || false;
    // if (config.method?.toUpperCase() === RequestEnum.GET) {
    //   if (!isString(params)) {
    //     // 给 get 请求加上时间戳参数，避免从缓存中拿数据。
    //     config.params = Object.assign(params || {}, joinTimestamp(joinTime, false));
    //   } else {
    //     // 兼容restful风格
    //     config.url = config.url + params + `${joinTimestamp(joinTime, true)}`;
    //     config.params = undefined;
    //   }
    // } else {
    //   if (!isString(params)) {
    //     formatDate && formatRequestDate(params);
    //     if (Reflect.has(config, 'data') && config.data && Object.keys(config.data).length) {
    //       config.data = data;
    //       config.params = params;
    //     } else {
    //       config.data = params;
    //       config.params = undefined;
    //     }
    //     if (joinParamsToUrl) {
    //       config.url = setObjToUrlParams(config.url as string, Object.assign({}, config.params, config.data));
    //     }
    //   } else {
    //     // 兼容restful风格
    //     config.url = config.url + params;
    //     config.params = undefined;
    //   }
    // }
    return config;
  }

  request<T = any>(config: AxiosRequestConfig, options?: RequestOptions): Promise<T> {
    console.log(options);
    const conf: AxiosRequestConfig = cloneDeep(config);
    const { requestOptions } = this.options;
    const opt: RequestOptions = Object.assign({}, requestOptions, options);
    return new Promise((resolve, reject) => {
      this.axiosInstance
        .request<any, AxiosResponse<Result>>(conf)
        .then((res: AxiosResponse<Result>) => {
          debugger;
          // 请求是否被取消
          const isCancel = axios.isCancel(res);
          if (!isCancel) {
            // const ret = transformRequestData(res, opt);
            // ret !== undefined ? resolve(ret) : reject(new Error('request error!'));
            return resolve(res as unknown as Promise<T>);
          }
          reject(res as unknown as Promise<T>);
        })
        .catch((e: Error) => {
          // if (requestCatch && isFunction(requestCatch)) {
          //   reject(requestCatch(e));
          //   return;
          // }
          reject(e);
        });
    });
  }
}
