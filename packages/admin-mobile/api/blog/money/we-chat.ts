import { blogRequest } from '../../../utils/request';
import type { ApiWeChatFindPageData, ApiWeChatItem, ApiWeChatUpdateData } from '/#/api/blog/money/we-chat';
import type { TablePaginationResult } from '/#/components/table';
import type { ApiStartEndTimeParams } from '/#/api/common';

const basic = '/money/we-chat';

export const getPage = (data: ApiWeChatFindPageData): Promise<TablePaginationResult<ApiWeChatItem[]>> => {
  return blogRequest({ url: `${basic}/find_page`, method: 'POST', data });
};

export const update = (data: ApiWeChatUpdateData): Promise<undefined> => {
  return blogRequest({ url: `${basic}/update`, method: 'PUT', data });
};

export const updateBalance = (params: ApiStartEndTimeParams): Promise<undefined> => {
  return blogRequest({ url: `${basic}/update_balance`, method: 'PUT', params });
};
