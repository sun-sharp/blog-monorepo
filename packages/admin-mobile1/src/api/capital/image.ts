import { RequestCapital } from '@/api/request';
import { ApiImageItem, ApiImagePageData, ReadImageItem } from '/#/api/capital/image';
import { TablePaginationResult } from '/#/vue/components/table';

const basic = '/image';

export const getPage = (data: ApiImagePageData): Promise<TablePaginationResult<ApiImageItem[]>> => {
  return RequestCapital.request({ url: `${basic}/find_page`, method: 'POST', data });
};

export const getOnlyPublic = (): Promise<ReadImageItem[]> => {
  return RequestCapital.request({ url: `${basic}/only_public`, method: 'GET' });
};

export const getOntUse = (): Promise<ApiImageItem[]> => {
  return RequestCapital.request({ url: `${basic}/not_use`, method: 'GET' });
};

export const removePublic = (fileName: string): Promise<undefined> => {
  return RequestCapital.request({ url: `${basic}/remove_public/${fileName}`, method: 'DELETE', responseOptions: { isShowSuccessMessage: false } });
};

export const removePublicAll = (fileNameArr: string[]): Promise<undefined> => {
  return RequestCapital.request({ url: `${basic}/remove_public_all`, method: 'DELETE', data: { fileNameArr }, responseOptions: { isShowSuccessMessage: false } });
};

export const removeData = (imageId: string): Promise<undefined> => {
  return RequestCapital.request({ url: `${basic}/remove_data/${imageId}`, method: 'DELETE', responseOptions: { isShowSuccessMessage: false } });
};

export const removePublicAndData = (imageId: string): Promise<undefined> => {
  return RequestCapital.request({ url: `${basic}/remove_public_data/${imageId}`, method: 'DELETE', responseOptions: { isShowSuccessMessage: false } });
};

export const removePublicAndDataAll = (imageIdArr: string[]): Promise<undefined> => {
  return RequestCapital.request({ url: `${basic}/remove_public_data_all`, method: 'DELETE', data: { imageIdArr }, responseOptions: { isShowSuccessMessage: false } });
};
