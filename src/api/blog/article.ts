import { AxiosBlog } from '@/api/axios';

const basic = '/article';

/**
 * @description 条件并分页获取文章列表
 * @param data
 */
export const getFindPage = (data?: any) => {
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
export const remove = (articleId?: string) => {
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
 * @param {any} data
 */
export const save = (data?: any) => {
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
 * @param {any} data
 */
export const update = (data?: any) => {
  return AxiosBlog.request({
    url: `${basic}/update`,
    method: 'PUT',
    data,
    responseOptions: {
      isShowSuccessMessage: true,
    },
  });
};
