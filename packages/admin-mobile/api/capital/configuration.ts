import { capitalRequest } from '../../utils/request';
import type { ApiConfigInfo, ApiConfiguration } from '/#/api/capital/configuration';

const basic = '/configuration';

export const getConfigInfo = (): Promise<ApiConfiguration> => {
  return capitalRequest({ url: `${basic}/info`, method: 'GET' });
};

export const update = (data: ApiConfigInfo): Promise<undefined> => {
  return capitalRequest({ url: `${basic}/update`, method: 'PUT', data, isShowSuccessMessage: true });
};
