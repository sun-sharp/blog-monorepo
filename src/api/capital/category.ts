import { AxiosCapital } from '@/api/axios';

const basic = '/category';

/**
 * @description: 获取配置信息
 * @param {string} type
 */
export function certainTypeAll(type: string) {
  return AxiosCapital.request({
    url: `${basic}/certain_type_all`,
    method: 'get',
    params: {
      type,
    },
  });
}
