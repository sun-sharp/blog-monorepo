import { blogRequest } from '../../../utils/request';
import type { ApiManualBillFindPageData, ApiManualBillItem, ApiManualBillSaveData, ApiManualBillUpdateData } from '/#/api/blog/money/manual-bill';
import type { TablePaginationResult } from '/#/components/table';

const basic = '/money/manual-bill';

export const save = (data: ApiManualBillSaveData): Promise<undefined> => {
  return blogRequest({ url: `${basic}/save`, method: 'POST', data, isShowSuccessMessage: true });
};

export const getPage = (data: ApiManualBillFindPageData): Promise<TablePaginationResult<ApiManualBillItem[]>> => {
  return blogRequest({ url: `${basic}/find_page`, method: 'POST', data });
};

export const getOne = (manualBillId: string): Promise<ApiManualBillItem> => {
  return blogRequest({ url: `${basic}/one/${manualBillId}`, method: 'GET' });
};

export const update = (data: ApiManualBillUpdateData): Promise<undefined> => {
  return blogRequest({ url: `${basic}/update`, method: 'PUT', data, isShowSuccessMessage: true });
};

export const remove = (manualBillId: string): Promise<undefined> => {
  return blogRequest({ url: `${basic}/remove/${manualBillId}`, method: 'DELETE', isShowSuccessMessage: true });
};
