import { blogRequest, uploadFileRequest } from '../../utils/request';
import type {
  ApiArticleFindPageData,
  ApiArticleItem,
  ApiArticleSaveData,
  ApiArticleUpdateData,
  ApiBatchUpdatePrivateArticleData,
  ApiLiteArticleItem,
  UploadMdResult,
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

export const uploadMd = (filePath: string): Promise<UploadMdResult> => {
  // const isH5 = (() => {
  //   try {
  //     return uni.getSystemInfoSync().uniPlatform === 'web';
  //   } catch {
  //     return false;
  //   }
  // })();
  // const BLOG_API_URL = import.meta.env.VITE_BLOG_API_URL || '/blog-api';
  // const BASE_URL = import.meta.env.VITE_BASE_URL || '';
  // const urlPrefix = isH5 ? BLOG_API_URL : `${BASE_URL}${BLOG_API_URL}`;
  // const token = uni.getStorageSync('ACCESS_TOKEN') || '';
  // const AUTH_HEAD = import.meta.env.VITE_AUTHORIZATION_HEAD || 'Bearer ';

  // return new Promise((resolve, reject) => {
  //   uni.uploadFile({
  //     url: `${urlPrefix}/article/upload_md`,
  //     filePath,
  //     name: 'file',
  //     header: { Authorization: AUTH_HEAD + token },
  //     success: (res) => {
  //       try {
  //         const data = JSON.parse(res.data);
  //         if (data.code === 0) resolve(data.result);
  //         else reject(new Error(data.message || '解析失败'));
  //       } catch {
  //         reject(new Error('解析响应失败'));
  //       }
  //     },
  //     fail: (err) => reject(err),
  //   });
  // });
  return uploadFileRequest(filePath);
};
