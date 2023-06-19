import { AxiosBlog } from '@/api/axios';
import { PaginateParams } from '/#/axios';

const basic = '/article';

interface FindPageData extends PaginateParams {
  categoryVal?: number;
}

/**
 * @description 条件并分页获取文章列表
 * @param {FindPageData} data
 */
export const getFindPage = (data: FindPageData) => {
  return AxiosBlog.request({
    url: `${basic}/find_page`,
    method: 'POST',
    data,
  });
};

/**
 * @description 条件并分页获取文章列表
 * @param {string} articleId
 */
export const getDetails = (articleId: string) => {
  return AxiosBlog.request({
    url: `${basic}/details`,
    method: 'GET',
    params: {
      articleId,
    },
  });
};
