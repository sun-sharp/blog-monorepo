import { AxiosCapital } from '@/api/axios';
import { ApiCategoryFindPageData, ApiCategoryItem, ApiCategorySaveData, ApiCategoryUpdateData } from '/#/api/capital/category';
import { TablePaginationResult } from '/#/components/table';

const basic = '/category';

/**
 * @description: 某种类型的所有配置
 * @param {string} type
 * @returns {Promise<ApiCategoryItem[]>}
 */
export const certainTypeAll = (type: string): Promise<ApiCategoryItem[]> => {
  return AxiosCapital.request({
    url: `${basic}/certain_type_all`,
    method: 'get',
    params: {
      type,
    },
  });
};

/**
 * @description: 条件并分页获取全局类型列表
 * @param {FindPageData} data
 * @returns {Promise<TablePaginationResult<ApiCategoryItem[]>>}
 */
export const getPage = (data: ApiCategoryFindPageData): Promise<TablePaginationResult<ApiCategoryItem[]>> => {
  return AxiosCapital.request({
    url: `${basic}/find_page`,
    method: 'POST',
    data,
  });
};

/**
 * @description: 获取全局类型详情
 * @param {string} categoryId
 * @return {Promise<ApiCategoryItem>}
 */
export const getOne = (categoryId: string): Promise<ApiCategoryItem> => {
  return AxiosCapital.request({
    url: `${basic}/one/${categoryId}`,
    method: 'GET',
  });
};

/**
 * @description 创建全局类型
 * @param {ApiCategorySaveData} data
 * @returns {Promise<undefined>}
 */
export const save = (data: ApiCategorySaveData): Promise<undefined> => {
  return AxiosCapital.request({
    url: `${basic}/save`,
    method: 'POST',
    data,
    responseOptions: {
      isShowSuccessMessage: true,
    },
  });
};

/**
 * @description 修改全局类型
 * @param {ApiCategoryUpdateData} data
 * @returns {Promise<undefined>}
 */
export const update = (data: ApiCategoryUpdateData): Promise<undefined> => {
  return AxiosCapital.request({
    url: `${basic}/update`,
    method: 'PUT',
    data,
    responseOptions: {
      isShowSuccessMessage: true,
    },
  });
};

/**
 * @description: 删除全局类型
 * @param {string} categoryId
 * @return {Promise<undefined>}
 */
export const remove = (categoryId: string): Promise<undefined> => {
  return AxiosCapital.request({
    url: `${basic}/${categoryId}`,
    method: 'DELETE',
    responseOptions: {
      isShowSuccessMessage: true,
    },
  });
};
