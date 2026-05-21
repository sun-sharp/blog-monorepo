import { blogRequest } from '../../utils/request';
import type { ApiScheduleFindPageData, ApiScheduleItem, ApiScheduleSaveData, ApiScheduleUpdateData } from '/#/api/blog/schedule';
import type { TablePaginationResult } from '/#/components/table';

const basic = '/schedule';

export const getFindPage = (data: ApiScheduleFindPageData): Promise<TablePaginationResult<ApiScheduleItem[]>> => {
  return blogRequest({ url: `${basic}/find_page`, method: 'POST', data });
};

export const remove = (id: string): Promise<undefined> => {
  return blogRequest({ url: `${basic}/${id}`, method: 'DELETE', isShowSuccessMessage: true });
};

export const save = (data: ApiScheduleSaveData): Promise<undefined> => {
  return blogRequest({ url: `${basic}/save`, method: 'POST', data, isShowSuccessMessage: true });
};

export const update = (data: ApiScheduleUpdateData): Promise<undefined> => {
  return blogRequest({ url: `${basic}/update`, method: 'PUT', data, isShowSuccessMessage: true });
};
