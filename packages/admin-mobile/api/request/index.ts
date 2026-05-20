import { CustomRequest } from './customRequest';
import { APP_ENV_CONFIG } from '@/constant';

export const RequestCapital = new CustomRequest({
  timeout: 60 * 1000,
  prefixUrl: '',
  requestOptions: {
    joinPrefix: true,
    formatDate: true,
    apiUrl: APP_ENV_CONFIG.capitalApiUrl as string,
  },
  responseOptions: {
    isTransformResponse: true,
    errorMessageMode: 'none',
  },
});

export const RequestBlog = new CustomRequest({
  timeout: 60 * 1000,
  prefixUrl: '',
  requestOptions: {
    joinPrefix: true,
    formatDate: true,
    apiUrl: APP_ENV_CONFIG.blogApiUrl as string,
  },
  responseOptions: {
    isTransformResponse: true,
    errorMessageMode: 'none',
  },
});
