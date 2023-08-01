import { AxiosCapital } from '@/api/axios';
import { ApiRoleItem, ApiRolePageData, ApiRoleSaveData, ApiRoleUpdateData } from '/#/api/role';

const basic = '/role';

/**
 * @description 分页查询角色列表
 * @param data
 */
export function getPage(data: ApiRolePageData): Promise<ApiRoleItem[]> {
  return AxiosCapital.request({
    url: `${basic}/role_page`,
    method: 'POST',
    data,
  });
}

/**
 * @description 查询全部角色列表
 */
export function getAll(): Promise<ApiRoleItem[]> {
  return AxiosCapital.request({
    url: `${basic}/all`,
    method: 'GET',
  });
}

/**
 * @description 新增角色
 * @param data
 */
export const save = (data: ApiRoleSaveData): Promise<undefined> => {
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
 * @description 修改角色
 * @param data
 */
export const update = (data: ApiRoleUpdateData): Promise<undefined> => {
  return AxiosCapital.request({
    url: `${basic}/update`,
    method: 'PUT',
    data,
    responseOptions: {
      isShowSuccessMessage: true,
    },
  });
};

/**
 * @description 删除角色
 * @param roleId
 */
export const remove = (roleId: string): Promise<undefined> => {
  return AxiosCapital.request({
    url: `${basic}/${roleId}`,
    method: 'DELETE',
    responseOptions: {
      isShowSuccessMessage: true,
    },
  });
};

/**
 * @description 获取全部api接口列表
 */
export function getApiAll() {
  return AxiosCapital.request({
    url: `${basic}/api_all`,
    method: 'GET',
  });
}
