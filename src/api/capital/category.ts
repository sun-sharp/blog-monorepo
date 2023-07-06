import { AxiosCapital } from '@/api/axios';
import { FindPageData } from '/#/api/category';

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

/**
 * @description: 支付宝账单列表
 * @param {FindPageData} data
 */
export const getPage = (data: FindPageData) => {
  return AxiosCapital.request({
    url: `${basic}/find_page`,
    method: 'POST',
    data,
  });
};
