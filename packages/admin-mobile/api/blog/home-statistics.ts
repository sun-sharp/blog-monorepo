import { blogRequest } from '../../utils/request';
import type { ApiHomeStatistics } from '/#/api/blog/home-statistics';

export const homeStatistics = (): Promise<ApiHomeStatistics> => {
  return blogRequest({ url: '/blog/home_statistics', method: 'GET' });
};
