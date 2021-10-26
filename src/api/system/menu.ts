import http from '@/utils/http/axios';

const basic = '/blog/user';

/**
 * @description: 根据用户id获取用户菜单
 */
export function adminMenus() {
  return http.request({
    url: `${basic}/menus`,
    method: 'GET',
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
