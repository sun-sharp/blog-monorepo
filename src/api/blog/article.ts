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
