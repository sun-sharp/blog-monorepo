import { capitalRequest } from '../../utils/request';
import type {
  ApiWaitForDoItem,
  ApiWaitForDoSaveData,
  ApiWaitForDoUpdateData,
  ApiWaitForDoUpdateSortData,
  ApiWaitForDoUpdateStateHasIdData,
} from '/#/api/capital/wait-for-do';

const basic = '/wait-for-do';

export const save = (data: ApiWaitForDoSaveData): Promise<undefined> => {
  return capitalRequest({ url: `${basic}/save`, method: 'POST', data, isShowSuccessMessage: true });
};

export const classifyAll = (classify: number, state: number): Promise<ApiWaitForDoItem[]> => {
  return capitalRequest({ url: `${basic}/classify_all`, method: 'GET', params: { classify, state } });
};

export const updateState = (data: ApiWaitForDoUpdateStateHasIdData): Promise<undefined> => {
  return capitalRequest({ url: `${basic}/update_state`, method: 'PUT', data });
};

export const updateSort = (data: ApiWaitForDoUpdateSortData[]): Promise<undefined> => {
  return capitalRequest({ url: `${basic}/update_sort`, method: 'PUT', data });
};

export const update = (data: ApiWaitForDoUpdateData): Promise<undefined> => {
  return capitalRequest({ url: `${basic}/update`, method: 'PUT', data });
};

export const detail = (waitForDoId: string): Promise<ApiWaitForDoItem> => {
  return capitalRequest({ url: `${basic}/${waitForDoId}`, method: 'GET' });
};

export const remove = (waitForDoId: string): Promise<undefined> => {
  return capitalRequest({ url: `${basic}/${waitForDoId}`, method: 'DELETE', isShowSuccessMessage: true });
};
