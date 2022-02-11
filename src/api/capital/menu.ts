import { AxiosCapital } from '@/api/axios';

const basic = '/menu';

/**
 * @description 获取菜单列表
 * @param params
 */
export function getMenuList(params?) {
  return AxiosCapital.request({
    url: `${basic}/find_term`,
    method: 'GET',
    params,
  });
}

/**
 * @description 新增菜单
 * @param data
 */
export const saveMenu = (data?) => {
  return AxiosCapital.request(
    {
      url: `${basic}/save`,
      method: 'POST',
      data,
    },
    {
      isShowSuccessMessage: true,
    }
  );
};

/**
 * @description 修改菜单
 * @param data
 */
export const updateMenu = (data?) => {
  return AxiosCapital.request(
    {
      url: `${basic}/update`,
      method: 'PUT',
      data,
    },
    {
      isShowSuccessMessage: true,
    }
  );
};

/**
 * @description 删除菜单
 * @param id
 */
export const removeMenu = (id?) => {
  return AxiosCapital.request(
    {
      url: `${basic}/remove`,
      method: 'POST',
      data: {
        id,
      },
    },
    {
      isShowSuccessMessage: true,
    }
  );
};
