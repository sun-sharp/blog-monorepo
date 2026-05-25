import { blogRequest } from '../../../utils/request';
import type { ApiAliPayFindPageData, ApiAliPayItem, ApiAliPayUpdateData, ApiAliPayBatchSaveData } from '/#/api/blog/money/ali-pay';
import type { TablePaginationResult } from '/#/components/table';
import type { ApiStartEndTimeParams } from '/#/api/common';

const basic = '/money/ali-pay';

export const getPage = (data: ApiAliPayFindPageData): Promise<TablePaginationResult<ApiAliPayItem[]>> => {
  return blogRequest({ url: `${basic}/find_page`, method: 'POST', data });
};

export const update = (data: ApiAliPayUpdateData): Promise<undefined> => {
  return blogRequest({ url: `${basic}/update`, method: 'PUT', data });
};

export const updateBalance = (data: ApiStartEndTimeParams): Promise<undefined> => {
  return blogRequest({ url: `${basic}/update_balance`, method: 'PUT', data });
};

export const updateBalanceBaby = (data: ApiStartEndTimeParams): Promise<undefined> => {
  return blogRequest({ url: `${basic}/update_balance_baby`, method: 'PUT', data });
};

export const batchSave = (data: ApiAliPayBatchSaveData): Promise<undefined> => {
  return blogRequest({ url: `${basic}/batch-save`, method: 'POST', data });
};
