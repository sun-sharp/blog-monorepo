import { RequestCapital } from '@/api/request';
import { ApiCapitalLoginData, ApiCapitalLoginResult, ApiCapitalSignUpData } from '/#/api/capital';
import { ApiResponse } from '/#/api/common';
import { ApiMenuItem } from '/#/api/capital/menu';

const basic = '';

export const login = (data: ApiCapitalLoginData): Promise<ApiResponse<ApiCapitalLoginResult>> => {
  return RequestCapital.request({
    url: `${basic}/login`,
    method: 'POST',
    data,
    responseOptions: {
      isTransformResponse: false,
    },
  });
};

export const adminMenus = (roleCode: string): Promise<ApiMenuItem[]> => {
  return RequestCapital.request({
    url: `${basic}/role_route`,
    method: 'GET',
    params: { roleCode },
  });
};

export const signUp = (data: ApiCapitalSignUpData): Promise<ApiResponse<string>> => {
  return RequestCapital.request({
    url: `${basic}/sign_up`,
    method: 'POST',
    data,
    responseOptions: {
      isTransformResponse: false,
    },
  });
};

export function removeUser(userId: string): Promise<undefined> {
  return RequestCapital.request({
    url: `${basic}/remove_user/${userId}`,
    method: 'DELETE',
    responseOptions: {
      isShowSuccessMessage: true,
    },
  });
}
