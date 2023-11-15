import { AxiosBlog } from '@/api/axios';
import { TablePaginationResult } from '/#/components/table';
import { ApiBillUploadFindPageData, ApiBillUploadItem, ApiBillUploadSaveData, ApiBillUploadUpdateData } from '/#/api/blog/bill-upload';

const basic = '/money/bill-upload';

/**
 * @description: 账单导入列表
 * @param {ApiBillUploadFindPageData} data
 * @returns {Promise<TablePaginationResult<ApiBillUploadItem[]>>}
 */
export const getPage = (data: ApiBillUploadFindPageData): Promise<TablePaginationResult<ApiBillUploadItem[]>> => {
  return AxiosBlog.request({
    url: `${basic}/find_page`,
    method: 'POST',
    data,
  });
};

/**
 * @description 创建全局类型
 * @param {ApiBillUploadSaveData} data
 * @returns {Promise<undefined>}
 */
export const save = (data: ApiBillUploadSaveData): Promise<undefined> => {
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
 * @description 修改全局类型
 * @param {ApiBillUploadUpdateData} data
 * @returns {Promise<undefined>}
 */
export const update = (data: ApiBillUploadUpdateData): Promise<undefined> => {
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
 * @description: 删除导入列表
 * @param {string} billUploadId
 * @return {Promise<undefined>}
 */
export const remove = (billUploadId: string): Promise<undefined> => {
  return AxiosBlog.request({
    url: `${basic}/${billUploadId}`,
    method: 'DELETE',
    responseOptions: {
      isShowSuccessMessage: true,
    },
  });
};
