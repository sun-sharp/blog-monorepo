import { AxiosBlog } from '@/api/axios';

const basic = '/article-category';

/**
 * @description: 新增文章分类
 * @param {any} data
 */
export const saveArticleCategory = (data?: any) => {
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
 * @description 获取全部文章分类列表
 * @param params
 */
export const getArticleCategoryAll = (params?: any) => {
  return AxiosBlog.request({
    url: `${basic}/all`,
    method: 'GET',
    params,
  });
};

/**
 * @description 删除文章分类
 * @param articleCategoryId
 */
export const remove = (articleCategoryId?: string) => {
  return AxiosBlog.request({
    url: `${basic}/${articleCategoryId}`,
    method: 'DELETE',
    responseOptions: {
      isShowSuccessMessage: true,
    },
  });
};
