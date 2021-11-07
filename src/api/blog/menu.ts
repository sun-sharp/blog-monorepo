import { AxiosBlog } from '@/api/axios';

const basic = '/menu';

/**
 * @description 根据用户id获取用户菜单
 * @param params
 */
export function adminMenus(params?) {
  return AxiosBlog.request({
    url: `${basic}/role_route`,
    method: 'GET',
    params,
  });
}

/**
 * @description 获取菜单列表
 * @param params
 */
export function getMenuList(params?) {
  return AxiosBlog.request({
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
  return AxiosBlog.request(
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
  return AxiosBlog.request(
    {
      url: `${basic}/update`,
      method: 'POST',
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
  return AxiosBlog.request(
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
