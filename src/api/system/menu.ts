import http from '@/api/axios';

const basic = '';

/**
 * @description: 根据用户id获取用户菜单
 */
export function adminMenus(params?) {
  return http.request({
    url: `${basic}/menus`,
    method: 'GET',
    params,
  });
}

/**
 * 获取tree菜单列表
 * @param params
 */
export function getMenuList(params?) {
  return http.request({
    url: `${basic}/menu/list`,
    method: 'GET',
    params,
  });
}
