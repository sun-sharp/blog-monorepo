import { AxiosBlog } from '@/api/axios';
import { ApiArticleFindPageData, ApiArticleItem, ApiArticleSaveData, ApiArticleUpdateData } from '/#/api/article';
import { TablePaginationResult } from '/#/components/table';

const basic = '/article';

/**
 * @description 条件并分页获取文章列表
 * @param {ApiArticleFindPageData} data
 * @returns {Promise<TablePaginationResult<ApiArticleItem[]>>}
 */
export const getFindPage = (data: ApiArticleFindPageData): Promise<TablePaginationResult<ApiArticleItem[]>> => {
  return AxiosBlog.request({
    url: `${basic}/find_page`,
    method: 'POST',
    data,
  });
};

/**
 * @description 删除文章
 * @param articleId
 */
export const remove = (articleId: string) => {
  return AxiosBlog.request({
    url: `${basic}/${articleId}`,
    method: 'DELETE',
    responseOptions: {
      isShowSuccessMessage: true,
    },
  });
};

/**
 * @description: 保存
 * @param {ApiArticleSaveData} data
 * @returns {Promise<undefined>}
 */
export const save = (data: ApiArticleSaveData): Promise<undefined> => {
  return AxiosBlog.request({
    url: `${basic}/save`,
    method: 'POST',
    data,
    responseOptions: {
      isShowSuccessMessage: true,
    },
  });
};

/**
 * @description: 修改文章
 * @param {ApiArticleUpdateData} data
 * @returns {Promise<undefined>}
 */
export const update = (data: ApiArticleUpdateData): Promise<undefined> => {
  return AxiosBlog.request({
    url: `${basic}/update`,
    method: 'PUT',
    data,
    responseOptions: {
      isShowSuccessMessage: true,
    },
  });
};
