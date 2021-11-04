import { AxiosBlog } from '@/api/axios';

const basic = '/menu';

/**
 * @description: 根据用户id获取用户菜单
 */
export function adminMenus(params?) {
  return AxiosBlog.request({
    url: `${basic}/role_route`,
    method: 'GET',
    params,
  });
}

/**
 * 获取菜单列表
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
 * 新增菜单
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
 * 修改菜单
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
 * 删除菜单
 * @param data
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
