import { capitalRequest } from '../../utils/request';
import type { ApiRoleItem, ApiRolePageData, ApiRoleSaveData, ApiRoleUpdateData } from '/#/api/capital/role';
import type { TablePaginationResult } from '/#/components/table';

const basic = '/role';

export function getPage(data: ApiRolePageData): Promise<TablePaginationResult<ApiRoleItem[]>> {
  return capitalRequest({ url: `${basic}/role_page`, method: 'POST', data });
}

export function getAll(): Promise<ApiRoleItem[]> {
  return capitalRequest({ url: `${basic}/all`, method: 'GET' });
}

export function getOne(roleId: string): Promise<ApiRoleItem> {
  return capitalRequest({ url: `${basic}/one/${roleId}`, method: 'GET' });
}

export const save = (data: ApiRoleSaveData): Promise<undefined> => {
  return capitalRequest({ url: `${basic}/save`, method: 'POST', data, isShowSuccessMessage: true });
};

export const update = (data: ApiRoleUpdateData): Promise<undefined> => {
  return capitalRequest({ url: `${basic}/update`, method: 'PUT', data, isShowSuccessMessage: true });
};

export const remove = (roleId: string): Promise<undefined> => {
  return capitalRequest({ url: `${basic}/${roleId}`, method: 'DELETE', isShowSuccessMessage: true });
};
