import { capitalRequest } from '../../utils/request';
import type { ApiImageItem, ApiImagePageData, ReadImageItem } from '/#/api/capital/image';
import type { TablePaginationResult } from '/#/components/table';

const basic = '/image';

export const getPage = (data: ApiImagePageData): Promise<TablePaginationResult<ApiImageItem[]>> => {
  return capitalRequest({ url: `${basic}/find_page`, method: 'POST', data });
};

export const getOnlyPublic = (): Promise<ReadImageItem[]> => {
  return capitalRequest({ url: `${basic}/only_public`, method: 'GET' });
};

export const getOntUse = (): Promise<ApiImageItem[]> => {
  return capitalRequest({ url: `${basic}/not_use`, method: 'GET' });
};

export const removePublic = (fileName: string): Promise<undefined> => {
  return capitalRequest({ url: `${basic}/remove_public/${fileName}`, method: 'DELETE' });
};

export const removePublicAll = (fileNameArr: string[]): Promise<undefined> => {
  return capitalRequest({ url: `${basic}/remove_public_all`, method: 'DELETE', data: { fileNameArr } });
};

export const removeData = (imageId: string): Promise<undefined> => {
  return capitalRequest({ url: `${basic}/remove_data/${imageId}`, method: 'DELETE' });
};

export const removePublicAndData = (imageId: string): Promise<undefined> => {
  return capitalRequest({ url: `${basic}/remove_public_data/${imageId}`, method: 'DELETE' });
};

export const removePublicAndDataAll = (imageIdArr: string[]): Promise<undefined> => {
  return capitalRequest({ url: `${basic}/remove_public_data_all`, method: 'DELETE', data: { imageIdArr } });
};

export const upload = (filePath: string, source?: string): Promise<any> => {
  const CAPITAL_API_URL = import.meta.env.VITE_CAPITAL_API_URL || '/capital-api';
  const BASE_URL = import.meta.env.VITE_BASE_URL || '';
  const AUTHORIZATION_HEAD = import.meta.env.VITE_AUTHORIZATION_HEAD || 'Bearer ';
  const token = uni.getStorageSync('ACCESS_TOKEN') || '';

  return new Promise((resolve, reject) => {
    uni.uploadFile({
      url: `${BASE_URL}${CAPITAL_API_URL}${basic}/upload`,
      filePath,
      name: 'file',
      header: {
        Authorization: AUTHORIZATION_HEAD + token,
      },
      formData: source ? { source } : {},
      success: (res) => {
        if (res.statusCode === 200) {
          try {
            const data = JSON.parse(res.data);
            if (data.code === 0) {
              resolve(data.result);
            } else {
              uni.showToast({ title: data.message || '上传失败', icon: 'none' });
              reject(new Error(data.message));
            }
          } catch {
            reject(new Error('解析响应失败'));
          }
        } else {
          uni.showToast({ title: `上传失败(${res.statusCode})`, icon: 'none' });
          reject(new Error(`上传失败: ${res.statusCode}`));
        }
      },
      fail: (err) => {
        uni.showToast({ title: '上传失败', icon: 'none' });
        reject(err);
      },
    });
  });
};
