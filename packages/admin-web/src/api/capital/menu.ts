import { AxiosCapital } from '@/api/axios';
import { ApiMenuItem, ApiMenuSaveData, ApiMenuUpdateData } from '/#/api/capital/menu';

const basic = '/menu';

/**
 * @description 获取菜单列表
 * @param params
 */
export const getMenuList = (): Promise<ApiMenuItem[]> => {
  return AxiosCapital.request({
    url: `${basic}/find_term`,
    method: 'GET',
  });
};

/**
 * @description 新增菜单
 * @param data
 */
export const saveMenu = (data: ApiMenuSaveData): Promise<undefined> => {
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
 * @description 修改菜单
 * @param data
 */
export const updateMenu = (data: ApiMenuUpdateData): Promise<undefined> => {
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
 * @description 删除菜单
 * @param menuId
 */
export const removeMenu = (menuId: string): Promise<undefined> => {
  return AxiosCapital.request({
    url: `${basic}/${menuId}`,
    method: 'DELETE',
    responseOptions: {
      isShowSuccessMessage: true,
    },
  });
};
