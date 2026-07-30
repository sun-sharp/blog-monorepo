import { capitalRequest } from '../../utils/request';
import type { ApiCategoryFindPageData, ApiCategoryItem, ApiCategorySaveData, ApiCategoryUpdateData } from '/#/api/capital/category';
import type { TablePaginationResult } from '/#/components/table';

const basic = '/category';

export const certainTypeAll = (type: string): Promise<ApiCategoryItem[]> => {
  return capitalRequest({ url: `${basic}/certain_type_all`, method: 'GET', data: { type } });
};

export const getPage = (data: ApiCategoryFindPageData): Promise<TablePaginationResult<ApiCategoryItem[]>> => {
  return capitalRequest({ url: `${basic}/find_page`, method: 'POST', data });
};

export const getOne = (categoryId: string): Promise<ApiCategoryItem> => {
  return capitalRequest({ url: `${basic}/one/${categoryId}`, method: 'GET' });
};

export const save = (data: ApiCategorySaveData): Promise<undefined> => {
  return capitalRequest({ url: `${basic}/save`, method: 'POST', data, isShowSuccessMessage: true });
};

export const update = (data: ApiCategoryUpdateData): Promise<undefined> => {
  return capitalRequest({ url: `${basic}/update`, method: 'PUT', data, isShowSuccessMessage: true });
};

export const remove = (categoryId: string): Promise<undefined> => {
  return capitalRequest({ url: `${basic}/${categoryId}`, method: 'DELETE', isShowSuccessMessage: true });
};
