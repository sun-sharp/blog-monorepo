import { blogRequest } from '../../utils/request';
import type {
  ApiArticleFindPageData,
  ApiArticleItem,
  ApiArticleSaveData,
  ApiArticleUpdateData,
  ApiBatchUpdatePrivateArticleData,
  ApiLiteArticleItem,
} from '/#/api/blog/article';
import type { TablePaginationResult } from '/#/components/table';

const basic = '/article';

export const getFindPage = (data: ApiArticleFindPageData): Promise<TablePaginationResult<ApiArticleItem[]>> => {
  return blogRequest({ url: `${basic}/find_all_page`, method: 'POST', data });
};

export const remove = (articleId: string): Promise<undefined> => {
  return blogRequest({ url: `${basic}/${articleId}`, method: 'DELETE', isShowSuccessMessage: true });
};

export const save = (data: ApiArticleSaveData): Promise<undefined> => {
  return blogRequest({ url: `${basic}/save`, method: 'POST', data, isShowSuccessMessage: true });
};

export const update = (data: ApiArticleUpdateData): Promise<undefined> => {
  return blogRequest({ url: `${basic}/update`, method: 'PUT', data, isShowSuccessMessage: true });
};

export const batchUpdatePrivate = (data: ApiBatchUpdatePrivateArticleData): Promise<undefined> => {
  return blogRequest({ url: `${basic}/batch_update_private`, method: 'PUT', data, isShowSuccessMessage: true });
};

export const getDetails = (articleId: string): Promise<ApiArticleItem> => {
  return blogRequest({ url: `${basic}/details`, method: 'GET', data: { articleId } });
};

export const getLitePage = (data: ApiArticleFindPageData): Promise<TablePaginationResult<ApiLiteArticleItem[]>> => {
  return blogRequest({ url: `${basic}/lite_page`, method: 'POST', data });
};
