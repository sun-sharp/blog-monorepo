import { capitalRequest } from '../../utils/request';
import type {
  ApiUserInfo,
  ApiUserItem,
  ApiUserPageData,
  ApiUserUpdateRoleCodeData,
  ApiUserUpdateUserInfoData,
  UserUpdateUserPassword,
} from '/#/api/capital/user';
import type { TablePaginationResult } from '/#/components/table';

const basic = '/user';

export const getUserInfo = (): Promise<ApiUserInfo> => {
  return capitalRequest({ url: `${basic}/admin_info`, method: 'GET' });
};

export const getPage = (data: ApiUserPageData): Promise<TablePaginationResult<ApiUserItem[]>> => {
  return capitalRequest({ url: `${basic}/find_page`, method: 'POST', data });
};

export const getOne = (userId: string): Promise<ApiUserItem> => {
  return capitalRequest({ url: `${basic}/${userId}`, method: 'GET' });
};

export const updateRoleCode = (data: ApiUserUpdateRoleCodeData): Promise<undefined> => {
  return capitalRequest({ url: `${basic}/update_role_code`, method: 'PUT', data, isShowSuccessMessage: true });
};

export const updateUserInfo = (data: ApiUserUpdateUserInfoData): Promise<undefined> => {
  return capitalRequest({ url: `${basic}/update_user_info`, method: 'PUT', data, isShowSuccessMessage: true });
};

export const remove = (userId?: string): Promise<undefined> => {
  return capitalRequest({ url: `${basic}/${userId}`, method: 'DELETE', isShowSuccessMessage: true });
};

export const updateUserPassword = (data: UserUpdateUserPassword): Promise<undefined> => {
  return capitalRequest({ url: `${basic}/update_user_password`, method: 'PUT', data, isShowSuccessMessage: true });
};
