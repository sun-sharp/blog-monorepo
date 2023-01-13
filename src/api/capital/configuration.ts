import { AxiosCapital } from '@/api/axios';

const basic = '/configuration';

/**
 * @description: 获取用户信息
 */
export function getConfigInfo() {
  return AxiosCapital.request({
    url: `${basic}/info`,
    method: 'get',
  });
}
