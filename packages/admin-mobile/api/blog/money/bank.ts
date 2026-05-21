import { blogRequest } from '../../../utils/request';
import type { ApiBankFindPageData, ApiBankItem, ApiBankUpdateData } from '/#/api/blog/money/bank';
import type { TablePaginationResult } from '/#/components/table';

const basic = '/money/bank';

export const getPage = (data: ApiBankFindPageData): Promise<TablePaginationResult<ApiBankItem[]>> => {
  return blogRequest({ url: `${basic}/find_page`, method: 'POST', data });
};

export const update = (data: ApiBankUpdateData): Promise<undefined> => {
  return blogRequest({ url: `${basic}/update`, method: 'PUT', data });
};

export const remove = (bankId: string): Promise<undefined> => {
  return blogRequest({ url: `${basic}/remove/${bankId}`, method: 'DELETE' });
};
