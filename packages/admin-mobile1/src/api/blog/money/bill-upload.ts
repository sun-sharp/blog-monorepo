import { RequestBlog } from '@/api/request';
import { TablePaginationResult } from '/#/vue/components/table';
import { ApiBillUploadFindPageData, ApiBillUploadItem, ApiBillUploadSaveData, ApiBillUploadUpdateData } from '/#/api/blog/bill-upload';

const basic = '/money/bill-upload';

export const getPage = (data: ApiBillUploadFindPageData): Promise<TablePaginationResult<ApiBillUploadItem[]>> => {
  return RequestBlog.request({ url: `${basic}/find_page`, method: 'POST', data });
};

export const save = (data: ApiBillUploadSaveData): Promise<undefined> => {
  return RequestBlog.request({ url: `${basic}/save`, method: 'POST', data, responseOptions: { isShowSuccessMessage: true } });
};

export const update = (data: ApiBillUploadUpdateData): Promise<undefined> => {
  return RequestBlog.request({ url: `${basic}/update`, method: 'PUT', data, responseOptions: { isShowSuccessMessage: true } });
};

export const remove = (billUploadId: string): Promise<undefined> => {
  return RequestBlog.request({ url: `${basic}/${billUploadId}`, method: 'DELETE', responseOptions: { isShowSuccessMessage: true } });
};
