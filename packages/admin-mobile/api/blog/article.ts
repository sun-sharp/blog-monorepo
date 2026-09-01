import { blogRequest, uploadFileRequest } from '../../utils/request';
import type {
  ApiArticleFindPageData,
  ApiArticleMobileDetails,
  ApiArticleSaveData,
  ApiArticleUpdateData,
  ApiBatchUpdatePrivateArticleData,
  ApiLiteArticleItem,
  UploadMdResult,
} from '/#/api/blog/article';
import type { TablePaginationResult } from '/#/components/table';

const basic = '/article';

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

export const getDetails = (articleId: string): Promise<ApiArticleMobileDetails> => {
  return blogRequest({ url: `${basic}/mobile_details`, method: 'GET', data: { articleId } });
};

export const getLitePage = (data: ApiArticleFindPageData): Promise<TablePaginationResult<ApiLiteArticleItem[]>> => {
  return blogRequest({ url: `${basic}/lite_page`, method: 'POST', data });
};

export const uploadMd = (filePath: string): Promise<UploadMdResult> => {
  return uploadFileRequest(filePath);
};

export const previewTemp = (data: { markdownContent: string; cssName?: string }): Promise<{ previewId: string }> => {
  return blogRequest({ url: `${basic}/preview_temp`, method: 'POST', data, isShowSuccessMessage: false });
};
