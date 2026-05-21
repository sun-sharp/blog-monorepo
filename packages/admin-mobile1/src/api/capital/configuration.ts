import { RequestCapital } from '@/api/request';
import { ApiConfigInfo, ApiConfiguration } from '/#/api/capital/configuration';

const basic = '/configuration';

export const getConfigInfo = (): Promise<ApiConfiguration> => {
  return RequestCapital.request({ url: `${basic}/info`, method: 'GET' });
};

export const update = (data: ApiConfigInfo): Promise<undefined> => {
  return RequestCapital.request({ url: `${basic}/update`, method: 'PUT', data, responseOptions: { isShowSuccessMessage: true } });
};
