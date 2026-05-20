import { RequestCapital } from '@/api/request';
import {
  ApiWaitForDoItem,
  ApiWaitForDoSaveData,
  ApiWaitForDoUpdateData,
  ApiWaitForDoUpdateSortData,
  ApiWaitForDoUpdateStateData,
} from '/#/api/capital/wait-for-do';

const basic = '/wait-for-do';

export const save = (data: ApiWaitForDoSaveData): Promise<undefined> => {
  return RequestCapital.request({
    url: `${basic}/save`,
    method: 'POST',
    data,
    responseOptions: {
      isShowSuccessMessage: true,
    },
  });
};

export const classifyAll = (classify: number, state: number): Promise<ApiWaitForDoItem[]> => {
  return RequestCapital.request({
    url: `${basic}/classify_all`,
    method: 'GET',
    params: { classify, state },
  });
};

export const updateState = (data: ApiWaitForDoUpdateStateData): Promise<undefined> => {
  return RequestCapital.request({
    url: `${basic}/update_state`,
    method: 'PUT',
    data,
  });
};

export const updateSort = (data: ApiWaitForDoUpdateSortData[]): Promise<undefined> => {
  return RequestCapital.request({
    url: `${basic}/update_sort`,
    method: 'PUT',
    data,
  });
};

export const update = (data: ApiWaitForDoUpdateData): Promise<undefined> => {
  return RequestCapital.request({
    url: `${basic}/update`,
    method: 'PUT',
    data,
  });
};

export const detail = (waitForDoId: string): Promise<ApiWaitForDoItem> => {
  return RequestCapital.request({
    url: `${basic}/${waitForDoId}`,
    method: 'GET',
  });
};

export const remove = (waitForDoId: string): Promise<undefined> => {
  return RequestCapital.request({
    url: `${basic}/${waitForDoId}`,
    method: 'DELETE',
    responseOptions: {
      isShowSuccessMessage: true,
    },
  });
};
