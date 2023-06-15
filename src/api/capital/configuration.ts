import { AxiosCapital } from '@/api/axios';

const basic = '/configuration';

/**
 * @description: 获取配置信息
 */
export function getConfigInfo() {
  return AxiosCapital.request({
    url: `${basic}/info`,
    method: 'get',
  });
}

/**
 * @description 修改配置信息
 * @param data
 */
export const update = (data?: any) => {
  return AxiosCapital.request({
    url: `${basic}/update`,
    method: 'PUT',
    data,
    responseOptions: {
      isShowSuccessMessage: true,
    },
  });
};
