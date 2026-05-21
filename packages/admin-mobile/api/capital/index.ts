import { capitalRequest } from '../../utils/request';
import type { ApiCapitalLoginData, ApiCapitalLoginResult, ApiCapitalSignUpData } from '/#/api/capital';
import type { ApiResponse } from '/#/api/common';
import type { ApiMenuItem } from '/#/api/capital/menu';

export const login = (data: ApiCapitalLoginData): Promise<ApiResponse<ApiCapitalLoginResult>> => {
  return capitalRequest({
    url: '/login',
    method: 'POST',
    data,
    isTransformResponse: false,
  });
};

export const adminMenus = (roleCode: string): Promise<ApiMenuItem[]> => {
  return capitalRequest({
    url: '/role_route',
    method: 'GET',
    params: { roleCode },
  });
};

export const signUp = (data: ApiCapitalSignUpData): Promise<ApiResponse<string>> => {
  return capitalRequest({
    url: '/sign_up',
    method: 'POST',
    data,
    isTransformResponse: false,
  });
};

export function removeUser(userId: string): Promise<undefined> {
  return capitalRequest({
    url: `/remove_user/${userId}`,
    method: 'DELETE',
    isShowSuccessMessage: true,
  });
}
