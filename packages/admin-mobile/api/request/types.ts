export interface RequestOptions {
  joinPrefix?: boolean;
  formatDate?: boolean;
  joinTime?: boolean;
  apiUrl?: string;
}

export interface ResponseOptions {
  isTransformResponse?: boolean;
  isShowMessage?: boolean;
  isShowErrorMessage?: boolean;
  isShowSuccessMessage?: boolean;
  successMessageText?: string;
  errorMessageText?: string;
  errorMessageMode?: 'none' | 'toast' | 'modal';
}

export interface CreateRequestOptions {
  timeout?: number;
  prefixUrl?: string;
  requestOptions?: RequestOptions;
  responseOptions?: ResponseOptions;
}

export interface CustomRequestConfig {
  url: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  data?: any;
  params?: any;
  headers?: Record<string, string>;
  responseType?: 'text' | 'arraybuffer';
  requestOptions?: Partial<RequestOptions>;
  responseOptions?: Partial<ResponseOptions>;
}
