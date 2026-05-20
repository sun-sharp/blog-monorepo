import { RequestBlog } from '@/api/request';
import { TablePaginationResult } from '/#/vue/components/table';
import { ApiScheduleFindPageData, ApiScheduleItem, ApiScheduleSaveData, ApiScheduleUpdateData } from '/#/api/blog/schedule';
import { ApiStartEndTimeParams } from '/#/api/common';

const basic = '/schedule';

export const getFindPage = (data: ApiScheduleFindPageData): Promise<TablePaginationResult<ApiScheduleItem[]>> => {
  return RequestBlog.request({
    url: `${basic}/find_page`,
    method: 'POST',
    data,
  });
};

export const remove = (id: string) => {
  return RequestBlog.request({
    url: `${basic}/${id}`,
    method: 'DELETE',
    responseOptions: {
      isShowSuccessMessage: true,
    },
  });
};

export const save = (data: ApiScheduleSaveData): Promise<undefined> => {
  return RequestBlog.request({
    url: `${basic}/save`,
    method: 'POST',
    data,
    responseOptions: {
      isShowSuccessMessage: true,
    },
  });
};

export const update = (data: ApiScheduleUpdateData): Promise<undefined> => {
  return RequestBlog.request({
    url: `${basic}/update`,
    method: 'PUT',
    data,
    responseOptions: {
      isShowSuccessMessage: true,
    },
  });
};

export const daily = (params: ApiStartEndTimeParams): Promise<any[]> => {
  return RequestBlog.request({
    url: `${basic}/daily`,
    method: 'GET',
    params,
  });
};
