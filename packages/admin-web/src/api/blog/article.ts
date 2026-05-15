import { AxiosBlog } from '@/api/axios';
import { ApiArticleFindPageData, ApiArticleItem, ApiArticleSaveData, ApiArticleUpdateData, ApiBatchUpdatePrivateArticleData } from '/#/api/blog/article';
import { TablePaginationResult } from '/#/components/table';

const basic = '/article';

/**
 * @description 条件并分页获取文章列表
 * @param {ApiArticleFindPageData} data
 * @returns {Promise<TablePaginationResult<ApiArticleItem[]>>}
 */
export const getFindPage = (data: ApiArticleFindPageData): Promise<TablePaginationResult<ApiArticleItem[]>> => {
  return AxiosBlog.request({
    url: `${basic}/find_all_page`,
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

/**
 * @description: 根据id批量修改文章加密
 * @param {ApiBatchUpdatePrivateArticleData} data
 * @returns {Promise<undefined>}
 */
export const batchUpdatePrivate = (data: ApiBatchUpdatePrivateArticleData): Promise<undefined> => {
  return AxiosBlog.request({
    url: `${basic}/batch_update_private`,
    method: 'PUT',
    data,
    responseOptions: {
      isShowSuccessMessage: true,
    },
  });
};

/**
 * @description 导出文章
 * @param articleId
 */
export const exportArticle = (articleId: string, fileName: string) => {
  return AxiosBlog.downloadExportFile(
    {
      url: `${basic}/export_article/${articleId}`,
      method: 'GET',
    },
    { fileName }
  );
};
