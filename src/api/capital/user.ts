import { AxiosCapital } from '@/api/axios';
import { ApiUserInfo } from '/#/api/user';

const basic = '/user';

/**
 * @description: 获取用户信息
 * @returns ApiUserInfo
 */
export const getUserInfo = (): Promise<ApiUserInfo> => {
  return AxiosCapital.request({
    url: `${basic}/admin_info`,
    method: 'get',
  });
};

/**
 * @description 用户列表
 * @param data
 */
export function getPage(data: any) {
  return AxiosCapital.request({
    url: `${basic}/find_page`,
    method: 'POST',
    data,
  });
}

/**
 * @description 新增用户
 * @param data
 */
export const save = (data?: any) => {
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
 * @description 修改用户
 * @param data
 */
export const updateRoleCode = (data?: { userId: string; roleCode: any }) => {
  return AxiosCapital.request({
    url: `${basic}/update_role_code`,
    method: 'PUT',
    data,
    responseOptions: {
      isShowSuccessMessage: true,
    },
  });
};

/**
 * @description 修改用户基本信息
 * @param data
 */
export const updateUserInfo = (data?: any) => {
  return AxiosCapital.request({
    url: `${basic}/update_user_info`,
    method: 'PUT',
    data,
    responseOptions: {
      isShowSuccessMessage: true,
    },
  });
};

/**
 * @description 删除用户
 * @param userId
 */
export const remove = (userId?: any) => {
  return AxiosCapital.request({
    url: `${basic}/${userId}`,
    method: 'DELETE',
    responseOptions: {
      isShowSuccessMessage: true,
    },
  });
};

/**
 * @description 更新用户密码
 * @param data
 */
export const updateUserPassword = (data: any) => {
  return AxiosCapital.request({
    url: `${basic}/update_user_password`,
    method: 'PUT',
    data,
    responseOptions: {
      isShowSuccessMessage: true,
    },
  });
};
