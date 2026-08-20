import { capitalRequest } from '../../utils/request';
import { ApiUricFindPageData, ApiUricItem, ApiUricSaveData } from '/#/api/capital/uric';
import type { TablePaginationResult } from '/#/components/table';

const basic = '/uric';

// export const certainTypeAll = (type: string): Promise<ApiCategoryItem[]> => {
//   return capitalRequest({ url: `${basic}/certain_type_all`, method: 'GET', data: { type } });
// };

export const getPage = (data: ApiUricFindPageData): Promise<TablePaginationResult<ApiUricItem[]>> => {
  return capitalRequest({ url: `${basic}/page`, method: 'POST', data });
};

export const getOne = (id: string): Promise<ApiUricItem> => {
  return capitalRequest({ url: `${basic}/one/${id}`, method: 'GET' });
};

export const save = (data: ApiUricSaveData): Promise<undefined> => {
  return capitalRequest({ url: `${basic}/save`, method: 'POST', data, isShowSuccessMessage: true });
};

// export const update = (data: ApiCategoryUpdateData): Promise<undefined> => {
//   return capitalRequest({ url: `${basic}/update`, method: 'PUT', data, isShowSuccessMessage: true });
// };

// export const remove = (categoryId: string): Promise<undefined> => {
//   return capitalRequest({ url: `${basic}/${categoryId}`, method: 'DELETE', isShowSuccessMessage: true });
// };
