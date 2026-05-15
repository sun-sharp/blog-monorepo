import { AxiosCapital } from '@/api/axios';
import { ApiCapitalLoginData, ApiCapitalLoginResult, ApiCapitalSignUpData } from '/#/api/capital';
import { ApiResponse } from '/#/api/common';
import { ApiMenuItem } from '/#/api/menu';

const basic = '';

/**
 * @description: 用户登录
 * @param data
 */
export const login = (data: ApiCapitalLoginData): Promise<ApiResponse<ApiCapitalLoginResult>> => {
  return AxiosCapital.request({
    url: `${basic}/login`,
    method: 'POST',
    data,
    responseOptions: {
      isTransformResponse: false,
    },
  });
};

/**
 * @description 根据roleCode获取用户菜单
 * @param params
 */
export const adminMenus = (roleCode: string): Promise<ApiMenuItem[]> => {
  return AxiosCapital.request({
    url: `${basic}/role_route`,
    method: 'GET',
    params: { roleCode },
  });
};

/**
 * @description 注册用户
 * @param data
 */
export const signUp = (data: ApiCapitalSignUpData): Promise<ApiResponse<string>> => {
  return AxiosCapital.request({
    url: `${basic}/sign_up`,
    method: 'POST',
    data,
    responseOptions: {
      isTransformResponse: false,
    },
  });
};

/**
 * @description 删除用户和用户相关数据
 * @param userId
 */
export function removeUser(userId: string): Promise<undefined> {
  return AxiosCapital.request({
    url: `${basic}/remove_user/${userId}`,
    method: 'DELETE',
    responseOptions: {
      isShowSuccessMessage: true,
    },
  });
}
