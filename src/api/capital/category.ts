import { AxiosCapital } from '@/api/axios';
import { ApiCategoryFindPageData, ApiCategorySaveData } from '/#/api/category';

const basic = '/category';

/**
 * @description: 某种类型的所有配置
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
 * @description: 条件并分页获取全局类型列表
 * @param {FindPageData} data
 */
export const getPage = (data: ApiCategoryFindPageData) => {
  return AxiosCapital.request({
    url: `${basic}/find_page`,
    method: 'POST',
    data,
  });
};

/**
 * @description 创建全局类型
 * @param data
 */
export const save = (data: ApiCategorySaveData) => {
  return AxiosCapital.request({
    url: `${basic}/save`,
    method: 'POST',
    data,
    responseOptions: {
      isShowSuccessMessage: true,
    },
  });
};
