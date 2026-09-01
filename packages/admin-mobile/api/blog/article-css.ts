import { blogRequest } from '../../utils/request';
import type { ApiArticleCssItem } from '/#/api/blog/article';

const basic = '/article-css';

export const list = (): Promise<ApiArticleCssItem[]> => {
  return blogRequest({ url: `${basic}/list`, method: 'GET', isShowSuccessMessage: false });
};
