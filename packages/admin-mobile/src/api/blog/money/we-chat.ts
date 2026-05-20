import { RequestBlog } from '@/api/request';
import { ApiWeChatBatchSaveData, ApiWeChatFindPageData, ApiWeChatItem, ApiWeChatUpdateData } from '/#/api/blog/money/we-chat';
import { TablePaginationResult } from '/#/vue/components/table';
import { ApiStartEndTimeParams } from '/#/api/common';

const basic = '/money/we-chat';

export const getPage = (data: ApiWeChatFindPageData): Promise<TablePaginationResult<ApiWeChatItem[]>> => {
  return RequestBlog.request({
    url: `${basic}/find_page`,
    method: 'POST',
    data,
  });
};

export const batchSave = (data: ApiWeChatBatchSaveData): Promise<undefined> => {
  return RequestBlog.request({
    url: `${basic}/batch-save`,
    method: 'POST',
    data,
  });
};

export const update = (data: ApiWeChatUpdateData): Promise<undefined> => {
  return RequestBlog.request({
    url: `${basic}/update`,
    method: 'PUT',
    data,
  });
};

export const updateBalance = (params: ApiStartEndTimeParams): Promise<undefined> => {
  return RequestBlog.request({
    url: `${basic}/update_balance`,
    method: 'PUT',
    params,
  });
};
