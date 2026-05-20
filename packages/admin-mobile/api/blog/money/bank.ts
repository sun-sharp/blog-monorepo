import { RequestBlog } from '@/api/request';
import { TablePaginationResult } from '/#/vue/components/table';
import { ApiBankBatchSaveData, ApiBankFindPageData, ApiBankItem, ApiBankUpdateData } from '/#/api/blog/money/bank';

const basic = '/money/bank';

export const getPage = (data: ApiBankFindPageData): Promise<TablePaginationResult<ApiBankItem[]>> => {
  return RequestBlog.request({
    url: `${basic}/find_page`,
    method: 'POST',
    data,
  });
};

export const batchSave = (data: ApiBankBatchSaveData): Promise<undefined> => {
  return RequestBlog.request({
    url: `${basic}/batch-save`,
    method: 'POST',
    data,
  });
};

export const update = (data: ApiBankUpdateData): Promise<undefined> => {
  return RequestBlog.request({
    url: `${basic}/update`,
    method: 'PUT',
    data,
  });
};

export const remove = (bankId: string): Promise<undefined> => {
  return RequestBlog.request({
    url: `${basic}/remove/${bankId}`,
    method: 'DELETE',
  });
};
