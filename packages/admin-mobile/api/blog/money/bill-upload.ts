import { blogRequest } from '../../../utils/request';
import type { ApiBillUploadFindPageData, ApiBillUploadItem, ApiBillUploadSaveData, ApiBillUploadUpdateData } from '/#/api/blog/bill-upload';
import type { TablePaginationResult } from '/#/components/table';

const basic = '/money/bill-upload';

export const getPage = (data: ApiBillUploadFindPageData): Promise<TablePaginationResult<ApiBillUploadItem[]>> => {
  return blogRequest({ url: `${basic}/find_page`, method: 'POST', data });
};

export const getOne = (billUploadId: string): Promise<ApiBillUploadItem> => {
  return blogRequest({ url: `${basic}/one/${billUploadId}`, method: 'GET' });
};

export const save = (data: ApiBillUploadSaveData): Promise<undefined> => {
  return blogRequest({ url: `${basic}/save`, method: 'POST', data, isShowSuccessMessage: true });
};

export const update = (data: ApiBillUploadUpdateData): Promise<undefined> => {
  return blogRequest({ url: `${basic}/update`, method: 'PUT', data, isShowSuccessMessage: true });
};

export const remove = (billUploadId: string): Promise<undefined> => {
  return blogRequest({ url: `${basic}/${billUploadId}`, method: 'DELETE', isShowSuccessMessage: true });
};
