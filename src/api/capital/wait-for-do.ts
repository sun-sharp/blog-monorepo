import { AxiosCapital } from '@/api/axios';
import { ApiWaitForDoSaveData, ApiWaitForDoUpdateData, ApiWaitForDoUpdateSortData, ApiWaitForDoUpdateStateData } from '/#/api/wait-for-do';

const basic = '/wait-for-do';

/**
 * @description 新增待办
 * @param data
 */
export const save = (data: ApiWaitForDoSaveData) => {
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
 * @description 某种类型的所有待办
 * @param data
 */
export const classifyAll = (classify: number, state: number) => {
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
 * @description 修改待办的状态
 * @param data
 */
export const updateState = (data: ApiWaitForDoUpdateStateData) => {
  return AxiosCapital.request({
    url: `${basic}/update_state`,
    method: 'PUT',
    data,
  });
};

/**
 * @description 批量修改待办的排序
 * @param data
 */
export const updateSort = (data: ApiWaitForDoUpdateSortData[]) => {
  return AxiosCapital.request({
    url: `${basic}/update_sort`,
    method: 'PUT',
    data,
  });
};

/**
 * @description 修改待办的名称，备注，截止时间
 * @param data
 */
export const update = (data: ApiWaitForDoUpdateData) => {
  return AxiosCapital.request({
    url: `${basic}/update`,
    method: 'PUT',
    data,
  });
};

/**
 * @description 批量修改待办的排序
 * @param waitForDoId
 */
export const detail = (waitForDoId: string) => {
  return AxiosCapital.request({
    url: `${basic}/${waitForDoId}`,
    method: 'GET',
  });
};

/**
 * @description 删除待办
 * @param waitForDoId
 */
export const remove = (waitForDoId: string) => {
  return AxiosCapital.request({
    url: `${basic}/${waitForDoId}`,
    method: 'DELETE',
    responseOptions: {
      isShowSuccessMessage: true,
    },
  });
};
