import { AxiosCapital } from '@/api/axios';
import { ApiConfigInfo, ApiConfiguration } from '/#/api/configuration';

const basic = '/configuration';

/**
 * @description: 获取配置信息
 */
export const getConfigInfo = (): Promise<ApiConfiguration> => {
  return AxiosCapital.request({
    url: `${basic}/info`,
    method: 'get',
  });
};

/**
 * @description 修改配置信息
 * @param data
 */
export const update = (data: ApiConfigInfo): Promise<undefined> => {
  return AxiosCapital.request({
    url: `${basic}/update`,
    method: 'PUT',
    data,
    responseOptions: {
      isShowSuccessMessage: true,
    },
  });
};
