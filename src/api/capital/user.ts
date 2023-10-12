import { AxiosCapital } from '@/api/axios';
import { ApiUserInfo, ApiUserItem, ApiUserPageData, ApiUserUpdateRoleCodeData, ApiUserUpdateUserInfoData, UserUpdateUserPassword } from '/#/api/user';
import { TablePaginationResult } from '/#/components/table';

const basic = '/user';

/**
 * @description: 获取用户信息
 * @return {Promise<ApiUserInfo>}
 */
export const getUserInfo = (): Promise<ApiUserInfo> => {
  return AxiosCapital.request({
    url: `${basic}/admin_info`,
    method: 'get',
  });
};

/**
 * @description: 用户列表
 * @param {ApiUserPageData} data
 * @return {Promise<ApiUserItem>}
 */
export const getPage = (data: ApiUserPageData): Promise<TablePaginationResult<ApiUserItem[]>> => {
  return AxiosCapital.request({
    url: `${basic}/find_page`,
    method: 'POST',
    data,
  });
};

/**
 * @description: 修改用户角色
 * @param {ApiUserUpdateRoleCodeData} data
 * @return {Promise<undefined>}
 */
export const updateRoleCode = (data: ApiUserUpdateRoleCodeData): Promise<undefined> => {
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
 * @description: 修改用户基本信息
 * @param {ApiUserUpdateUserInfoData} data
 * @return {Promise<undefined>}
 */
export const updateUserInfo = (data: ApiUserUpdateUserInfoData): Promise<undefined> => {
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
export const remove = (userId?: string): Promise<undefined> => {
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
export const updateUserPassword = (data: UserUpdateUserPassword): Promise<undefined> => {
  return AxiosCapital.request({
    url: `${basic}/update_user_password`,
    method: 'PUT',
    data,
    responseOptions: {
      isShowSuccessMessage: true,
    },
  });
};
