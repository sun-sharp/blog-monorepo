import { AxiosCapital } from '@/api/axios';
import { ApiWaitForDoSaveData } from '/#/api/wait-for-do';

const basic = '/wait-for-do';

/**
 * @description 新增待办
 * @param data
 */
export const save = (data?: ApiWaitForDoSaveData) => {
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
