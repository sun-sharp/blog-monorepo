import { AxiosCapital } from '@/api/axios';
import { ApiFindPageData, ApiSaveData } from '/#/api/category';

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
export const getPage = (data: ApiFindPageData) => {
  return AxiosCapital.request({
    url: `${basic}/find_page`,
    method: 'POST',
    data,
  });
};

/**
 * @description 新增用户
 * @param data
 */
export const save = (data: ApiSaveData) => {
  return AxiosCapital.request({
    url: `${basic}/save`,
    method: 'POST',
    data,
    responseOptions: {
      isShowSuccessMessage: true,
    },
  });
};
