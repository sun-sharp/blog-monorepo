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
