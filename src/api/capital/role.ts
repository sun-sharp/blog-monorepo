import { AxiosCapital } from '@/api/axios';

const basic = '/role';

/**
 * @description 分页查询角色列表
 * @param data
 */
export function getPage(data: any) {
  return AxiosCapital.request({
    url: `${basic}/role_page`,
    method: 'POST',
    data,
  });
}

/**
 * @description 查询全部角色列表
 * @param params
 */
export function getAll(params?) {
  return AxiosCapital.request({
    url: `${basic}/all`,
    method: 'GET',
    params,
  });
}

/**
 * @description 新增角色
 * @param data
 */
export const save = (data?) => {
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
export const update = (data?) => {
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
export const remove = (roleId?) => {
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
 * @param params
 */
export function getApiAll(params?: any) {
  return AxiosCapital.request({
    url: `${basic}/api_all`,
    method: 'GET',
    params,
  });
}
