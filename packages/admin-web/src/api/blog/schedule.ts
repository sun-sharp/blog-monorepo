import { AxiosBlog } from '@/api/axios';
import { TablePaginationResult } from '/#/components/table';
import { ApiScheduleFindPageData, ApiScheduleItem, ApiScheduleSaveData, ApiScheduleUpdateData } from '/#/api/blog/schedule';
import { ApiStartEndTimeParams } from '/#/api/common';
import { ScheduleDailyItem } from '/#/views/schedule';

const basic = '/schedule';

/**
 * @description 条件并分页获取列表
 * @param {ApiScheduleFindPageData} data
 * @returns {Promise<TablePaginationResult<ApiScheduleItem[]>>}
 */
export const getFindPage = (data: ApiScheduleFindPageData): Promise<TablePaginationResult<ApiScheduleItem[]>> => {
  return AxiosBlog.request({
    url: `${basic}/find_page`,
    method: 'POST',
    data,
  });
};

/**
 * @description 删除
 * @param id
 */
export const remove = (id: string) => {
  return AxiosBlog.request({
    url: `${basic}/${id}`,
    method: 'DELETE',
    responseOptions: {
      isShowSuccessMessage: true,
    },
  });
};

/**
 * @description: 保存
 * @param {ApiScheduleSaveData} data
 * @returns {Promise<undefined>}
 */
export const save = (data: ApiScheduleSaveData): Promise<undefined> => {
  return AxiosBlog.request({
    url: `${basic}/save`,
    method: 'POST',
    data,
    responseOptions: {
      isShowSuccessMessage: true,
    },
  });
};

/**
 * @description: 修改
 * @param {ApiScheduleUpdateData} data
 * @returns {Promise<undefined>}
 */
export const update = (data: ApiScheduleUpdateData): Promise<undefined> => {
  return AxiosBlog.request({
    url: `${basic}/update`,
    method: 'PUT',
    data,
    responseOptions: {
      isShowSuccessMessage: true,
    },
  });
};

/**
 * @description: 修改
 * @param {ApiStartEndTimeParams} params
 * @returns {Promise<ScheduleDailyItem[]>}
 */
export const daily = (params: ApiStartEndTimeParams): Promise<ScheduleDailyItem[]> => {
  return AxiosBlog.request({
    url: `${basic}/daily`,
    method: 'GET',
    params,
  });
};
