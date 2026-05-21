import { RequestCapital } from '@/api/request';
import { ApiRoleItem, ApiRolePageData, ApiRoleSaveData, ApiRoleUpdateData, ApiSwaggerJsonAllAssociateResult } from '/#/api/capital/role';
import { TablePaginationResult } from '/#/vue/components/table';

const basic = '/role';

export function getPage(data: ApiRolePageData): Promise<TablePaginationResult<ApiRoleItem[]>> {
  return RequestCapital.request({ url: `${basic}/role_page`, method: 'POST', data });
}

export function getAll(): Promise<ApiRoleItem[]> {
  return RequestCapital.request({ url: `${basic}/all`, method: 'GET' });
}

export const save = (data: ApiRoleSaveData): Promise<undefined> => {
  return RequestCapital.request({ url: `${basic}/save`, method: 'POST', data, responseOptions: { isShowSuccessMessage: true } });
};

export const update = (data: ApiRoleUpdateData): Promise<undefined> => {
  return RequestCapital.request({ url: `${basic}/update`, method: 'PUT', data, responseOptions: { isShowSuccessMessage: true } });
};

export const remove = (roleId: string): Promise<undefined> => {
  return RequestCapital.request({ url: `${basic}/${roleId}`, method: 'DELETE', responseOptions: { isShowSuccessMessage: true } });
};

export function getApiAll(): Promise<ApiSwaggerJsonAllAssociateResult[]> {
  return RequestCapital.request({ url: `${basic}/api_all`, method: 'GET' });
}
