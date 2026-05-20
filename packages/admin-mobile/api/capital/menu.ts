import { RequestCapital } from '@/api/request';
import { ApiMenuItem, ApiMenuSaveData, ApiMenuUpdateData } from '/#/api/capital/menu';

const basic = '/menu';

export const getMenuList = (): Promise<ApiMenuItem[]> => {
  return RequestCapital.request({
    url: `${basic}/find_term`,
    method: 'GET',
  });
};

export const saveMenu = (data: ApiMenuSaveData): Promise<undefined> => {
  return RequestCapital.request({
    url: `${basic}/save`,
    method: 'POST',
    data,
    responseOptions: {
      isShowSuccessMessage: true,
    },
  });
};

export const updateMenu = (data: ApiMenuUpdateData): Promise<undefined> => {
  return RequestCapital.request({
    url: `${basic}/update`,
    method: 'PUT',
    data,
    responseOptions: {
      isShowSuccessMessage: true,
    },
  });
};

export const removeMenu = (menuId: string): Promise<undefined> => {
  return RequestCapital.request({
    url: `${basic}/${menuId}`,
    method: 'DELETE',
    responseOptions: {
      isShowSuccessMessage: true,
    },
  });
};
