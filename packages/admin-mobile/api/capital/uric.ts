import { capitalRequest } from '../../utils/request';
import { ApiUricFindPageData, ApiUricItem, ApiUricSaveData, ApiUricUpdateData } from '/#/api/capital/uric';
import type { TablePaginationResult } from '/#/components/table';

const basic = '/uric';

export const getPage = (data: ApiUricFindPageData): Promise<TablePaginationResult<ApiUricItem[]>> => {
  return capitalRequest({ url: `${basic}/page`, method: 'POST', data });
};

export const details = (id: string): Promise<ApiUricItem> => {
  return capitalRequest({ url: `${basic}/details/${id}`, method: 'GET' });
};

export const save = (data: ApiUricSaveData): Promise<undefined> => {
  return capitalRequest({ url: `${basic}/save`, method: 'POST', data, isShowSuccessMessage: true });
};

export const update = (data: ApiUricUpdateData): Promise<undefined> => {
  return capitalRequest({ url: `${basic}/update`, method: 'PUT', data, isShowSuccessMessage: true });
};

export const remove = (uricId: string): Promise<undefined> => {
  return capitalRequest({ url: `${basic}/${uricId}`, method: 'DELETE', isShowSuccessMessage: true });
};
