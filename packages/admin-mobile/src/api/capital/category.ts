import { RequestCapital } from '@/api/request';
import { ApiCategoryFindPageData, ApiCategoryItem, ApiCategorySaveData, ApiCategoryUpdateData } from '/#/api/capital/category';
import { TablePaginationResult } from '/#/vue/components/table';

const basic = '/category';

export const certainTypeAll = (type: string): Promise<ApiCategoryItem[]> => {
  return RequestCapital.request({
    url: `${basic}/certain_type_all`,
    method: 'GET',
    params: { type },
  });
};

export const getPage = (data: ApiCategoryFindPageData): Promise<TablePaginationResult<ApiCategoryItem[]>> => {
  return RequestCapital.request({
    url: `${basic}/find_page`,
    method: 'POST',
    data,
  });
};

export const save = (data: ApiCategorySaveData): Promise<undefined> => {
  return RequestCapital.request({
    url: `${basic}/save`,
    method: 'POST',
    data,
    responseOptions: {
      isShowSuccessMessage: true,
    },
  });
};

export const update = (data: ApiCategoryUpdateData): Promise<undefined> => {
  return RequestCapital.request({
    url: `${basic}/update`,
    method: 'PUT',
    data,
    responseOptions: {
      isShowSuccessMessage: true,
    },
  });
};

export const remove = (categoryId: string): Promise<undefined> => {
  return RequestCapital.request({
    url: `${basic}/${categoryId}`,
    method: 'DELETE',
    responseOptions: {
      isShowSuccessMessage: true,
    },
  });
};
