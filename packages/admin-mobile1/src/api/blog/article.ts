import { RequestBlog } from '@/api/request';
import { ApiArticleFindPageData, ApiArticleItem, ApiArticleSaveData, ApiArticleUpdateData, ApiBatchUpdatePrivateArticleData } from '/#/api/blog/article';
import { TablePaginationResult } from '/#/vue/components/table';

const basic = '/article';

export const getFindPage = (data: ApiArticleFindPageData): Promise<TablePaginationResult<ApiArticleItem[]>> => {
  return RequestBlog.request({ url: `${basic}/find_all_page`, method: 'POST', data });
};

export const remove = (articleId: string) => {
  return RequestBlog.request({ url: `${basic}/${articleId}`, method: 'DELETE', responseOptions: { isShowSuccessMessage: true } });
};

export const save = (data: ApiArticleSaveData): Promise<undefined> => {
  return RequestBlog.request({ url: `${basic}/save`, method: 'POST', data, responseOptions: { isShowSuccessMessage: true } });
};

export const update = (data: ApiArticleUpdateData): Promise<undefined> => {
  return RequestBlog.request({ url: `${basic}/update`, method: 'PUT', data, responseOptions: { isShowSuccessMessage: true } });
};

export const batchUpdatePrivate = (data: ApiBatchUpdatePrivateArticleData): Promise<undefined> => {
  return RequestBlog.request({ url: `${basic}/batch_update_private`, method: 'PUT', data, responseOptions: { isShowSuccessMessage: true } });
};
