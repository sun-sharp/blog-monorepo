import { RequestBlog } from '@/api/request';
import { ApiAliPayBatchSaveData, ApiAliPayFindPageData, ApiAliPayItem, ApiAliPayUpdateData } from '/#/api/blog/money/ali-pay';
import { TablePaginationResult } from '/#/vue/components/table';
import { ApiStartEndTimeParams } from '/#/api/common';

const basic = '/money/ali-pay';

export const getPage = (data: ApiAliPayFindPageData): Promise<TablePaginationResult<ApiAliPayItem[]>> => {
  return RequestBlog.request({ url: `${basic}/find_page`, method: 'POST', data });
};

export const batchSave = (data: ApiAliPayBatchSaveData): Promise<undefined> => {
  return RequestBlog.request({ url: `${basic}/batch-save`, method: 'POST', data });
};

export const update = (data: ApiAliPayUpdateData): Promise<undefined> => {
  return RequestBlog.request({ url: `${basic}/update`, method: 'PUT', data });
};

export const updateBalance = (params: ApiStartEndTimeParams): Promise<undefined> => {
  return RequestBlog.request({ url: `${basic}/update_balance`, method: 'PUT', params });
};

export const updateBalanceBaby = (params: ApiStartEndTimeParams): Promise<undefined> => {
  return RequestBlog.request({ url: `${basic}/update_balance_baby`, method: 'PUT', params });
};
