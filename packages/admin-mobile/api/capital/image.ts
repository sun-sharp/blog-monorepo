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
