import { AxiosCapital } from '@/api/axios';
import {
  ApiWaitForDoItem,
  ApiWaitForDoSaveData,
  ApiWaitForDoUpdateData,
  ApiWaitForDoUpdateSortData,
  ApiWaitForDoUpdateStateHasIdData,
} from '/#/api/capital/wait-for-do';

const basic = '/wait-for-do';

/**
 * @description: 新增待办
 * @param {ApiWaitForDoSaveData} data
 * @return {Promise<undefined>}
 */
export const save = (data: ApiWaitForDoSaveData): Promise<undefined> => {
  return AxiosCapital.request({
    url: `${basic}/save`,
    method: 'POST',
    data,
    responseOptions: {
      isShowSuccessMessage: true,
    },
  });
};

/**
 * @description: 某种类型的所有待办
 * @param {number} classify
 * @param {number} state
 * @return {Promise<ApiWaitForDoItem[]>}
 */
export const classifyAll = (classify: number, state: number): Promise<ApiWaitForDoItem[]> => {
  return AxiosCapital.request({
    url: `${basic}/classify_all`,
    method: 'GET',
    params: {
      classify,
      state,
    },
  });
};

/**
 * @description: 修改待办的状态
 * @param {ApiWaitForDoUpdateStateHasIdData} data
 * @return {: Promise<undefined>}
 */
export const updateState = (data: ApiWaitForDoUpdateStateHasIdData): Promise<undefined> => {
  return AxiosCapital.request({
    url: `${basic}/update_state`,
    method: 'PUT',
    data,
  });
};

/**
 * @description: 批量修改待办的排序
 * @param {ApiWaitForDoUpdateSortData} data
 * @return {Promise<undefined>}
 */
export const updateSort = (data: ApiWaitForDoUpdateSortData[]): Promise<undefined> => {
  return AxiosCapital.request({
    url: `${basic}/update_sort`,
    method: 'PUT',
    data,
  });
};

/**
 * @description: 修改待办的名称，备注，截止时间
 * @param {ApiWaitForDoUpdateData} data
 * @return {Promise<undefined>}
 */
export const update = (data: ApiWaitForDoUpdateData): Promise<undefined> => {
  return AxiosCapital.request({
    url: `${basic}/update`,
    method: 'PUT',
    data,
  });
};

/**
 * @description: 批量修改待办的排序
 * @param {string} waitForDoId
 * @return {Promise<ApiWaitForDoItem>}
 */
export const detail = (waitForDoId: string): Promise<ApiWaitForDoItem> => {
  return AxiosCapital.request({
    url: `${basic}/${waitForDoId}`,
    method: 'GET',
  });
};

/**
 * @description: 删除待办
 * @param {string} waitForDoId
 * @return {Promise<undefined>}
 */
export const remove = (waitForDoId: string): Promise<undefined> => {
  return AxiosCapital.request({
    url: `${basic}/${waitForDoId}`,
    method: 'DELETE',
    responseOptions: {
      isShowSuccessMessage: true,
    },
  });
};
