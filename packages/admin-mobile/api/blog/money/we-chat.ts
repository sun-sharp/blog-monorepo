import { blogRequest } from '../../../utils/request';
import type { ApiWeChatFindPageData, ApiWeChatItem, ApiWeChatUpdateData, ApiWeChatBatchSaveData } from '/#/api/blog/money/we-chat';
import type { TablePaginationResult } from '/#/components/table';
import type { ApiStartEndTimeParams } from '/#/api/common';

const basic = '/money/we-chat';

export const getPage = (data: ApiWeChatFindPageData): Promise<TablePaginationResult<ApiWeChatItem[]>> => {
  return blogRequest({ url: `${basic}/find_page`, method: 'POST', data });
};

export const update = (data: ApiWeChatUpdateData): Promise<undefined> => {
  return blogRequest({ url: `${basic}/update`, method: 'PUT', data });
};

export const updateBalance = (data: ApiStartEndTimeParams): Promise<undefined> => {
  return blogRequest({ url: `${basic}/update_balance`, method: 'PUT', data, timeout: 120000 });
};

export const batchSave = (data: ApiWeChatBatchSaveData): Promise<undefined> => {
  return blogRequest({ url: `${basic}/batch-save`, method: 'POST', data });
};
