import { RequestCapital } from '@/api/request';
import { ApiUserInfo, ApiUserItem, ApiUserPageData, ApiUserUpdateRoleCodeData, ApiUserUpdateUserInfoData, UserUpdateUserPassword } from '/#/api/capital/user';
import { TablePaginationResult } from '/#/vue/components/table';

const basic = '/user';

export const getUserInfo = (): Promise<ApiUserInfo> => {
  return RequestCapital.request({ url: `${basic}/admin_info`, method: 'GET' });
};

export const getPage = (data: ApiUserPageData): Promise<TablePaginationResult<ApiUserItem[]>> => {
  return RequestCapital.request({ url: `${basic}/find_page`, method: 'POST', data });
};

export const updateRoleCode = (data: ApiUserUpdateRoleCodeData): Promise<undefined> => {
  return RequestCapital.request({ url: `${basic}/update_role_code`, method: 'PUT', data, responseOptions: { isShowSuccessMessage: true } });
};

export const updateUserInfo = (data: ApiUserUpdateUserInfoData): Promise<undefined> => {
  return RequestCapital.request({ url: `${basic}/update_user_info`, method: 'PUT', data, responseOptions: { isShowSuccessMessage: true } });
};

export const remove = (userId?: string): Promise<undefined> => {
  return RequestCapital.request({ url: `${basic}/${userId}`, method: 'DELETE', responseOptions: { isShowSuccessMessage: true } });
};

export const updateUserPassword = (data: UserUpdateUserPassword): Promise<undefined> => {
  return RequestCapital.request({ url: `${basic}/update_user_password`, method: 'PUT', data, responseOptions: { isShowSuccessMessage: true } });
};
