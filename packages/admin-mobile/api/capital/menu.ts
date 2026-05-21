import { capitalRequest } from '../../utils/request';
import type { ApiMenuItem, ApiMenuSaveData, ApiMenuUpdateData } from '/#/api/capital/menu';

const basic = '/menu';

export const getMenuList = (): Promise<ApiMenuItem[]> => {
  return capitalRequest({ url: `${basic}/find_term`, method: 'GET' });
};

export const saveMenu = (data: ApiMenuSaveData): Promise<undefined> => {
  return capitalRequest({ url: `${basic}/save`, method: 'POST', data, isShowSuccessMessage: true });
};

export const updateMenu = (data: ApiMenuUpdateData): Promise<undefined> => {
  return capitalRequest({ url: `${basic}/update`, method: 'PUT', data, isShowSuccessMessage: true });
};

export const removeMenu = (menuId: string): Promise<undefined> => {
  return capitalRequest({ url: `${basic}/${menuId}`, method: 'DELETE', isShowSuccessMessage: true });
};
