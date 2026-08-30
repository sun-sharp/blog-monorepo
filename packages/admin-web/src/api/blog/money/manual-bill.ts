import { AxiosBlog } from '@/api/axios';
import { ApiManualBillFindPageData, ApiManualBillItem, ApiManualBillSaveData, ApiManualBillUpdateData } from '/#/api/blog/money/manual-bill';
import { TablePaginationResult } from '/#/components/table';

const basic = '/money/manual-bill';

/**
 * @description: 手写账单列表
 * @param {ApiManualBillFindPageData} data
 */
export const getPage = (data: ApiManualBillFindPageData): Promise<TablePaginationResult<ApiManualBillItem[]>> => {
  return AxiosBlog.request({
    url: `${basic}/find_page`,
    method: 'POST',
    data,
  });
};

/**
 * @description: 保存手写账单
 * @param {ApiManualBillSaveData} data
 */
export const save = (data: ApiManualBillSaveData): Promise<undefined> => {
  return AxiosBlog.request({
    url: `${basic}/save`,
    method: 'POST',
    data,
  });
};

/**
 * @description: 查询手写账单详情
 * @param {string} manualBillId
 */
export const getOne = (manualBillId: string): Promise<ApiManualBillItem> => {
  return AxiosBlog.request({
    url: `${basic}/one/${manualBillId}`,
    method: 'GET',
  });
};

/**
 * @description: 修改手写账单
 * @param {ApiManualBillUpdateData} data
 */
export const update = (data: ApiManualBillUpdateData): Promise<undefined> => {
  return AxiosBlog.request({
    url: `${basic}/update`,
    method: 'PUT',
    data,
  });
};

/**
 * @description: 删除手写账单
 * @param {string} manualBillId
 */
export const remove = (manualBillId: string): Promise<undefined> => {
  return AxiosBlog.request({
    url: `${basic}/remove/${manualBillId}`,
    method: 'DELETE',
  });
};
