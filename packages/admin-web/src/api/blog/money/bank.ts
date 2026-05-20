import { AxiosBlog } from '@/api/axios';
import { TablePaginationResult } from '/#/components/table';
import { ApiBankBatchSaveData, ApiBankFindPageData, ApiBankItem, ApiBankUpdateData } from '/#/api/blog/money/bank';

const basic = '/money/bank';

/**
 * @description: 银行账单列表
 * @param {ApiBankFindPageData} data
 * @returns {Promise<TablePaginationResult<ApiBankItem[]>>}
 */
export const getPage = (data: ApiBankFindPageData): Promise<TablePaginationResult<ApiBankItem[]>> => {
  return AxiosBlog.request({
    url: `${basic}/find_page`,
    method: 'POST',
    data,
  });
};

/**
 * @description: 批量保存银行账单
 * @param {ApiBankBatchSaveData} data
 * @returns {Promise<undefined>}
 */
export const batchSave = (data: ApiBankBatchSaveData): Promise<undefined> => {
  return AxiosBlog.request({
    url: `${basic}/batch-save`,
    method: 'POST',
    data,
  });
};

/**
 * @description: 修改银行账单
 * @param {ApiBankUpdateData} data
 */
export const update = (data: ApiBankUpdateData): Promise<undefined> => {
  return AxiosBlog.request({
    url: `${basic}/update`,
    method: 'PUT',
    data,
  });
};

// /**
//  * @description: 批量删除银行账单
//  * @param {any} data
//  */
// export const batchRemove = (data: any) => {
//   return AxiosBlog.request({
//     url: `${basic}/batch_remove`,
//     method: 'DELETE',
//     data,
//   });
// };

/**
 * @description: 删除银行账单
 * @param {string} bankId
 * @returns {Promise<undefined>}
 */
export const remove = (bankId: string): Promise<undefined> => {
  return AxiosBlog.request({
    url: `${basic}/remove/${bankId}`,
    method: 'DELETE',
  });
};
