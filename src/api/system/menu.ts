import http from '@/api/axios';

const basic = '/menu';

/**
 * @description: 根据用户id获取用户菜单
 */
export function adminMenus(params?) {
  return http.request({
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
  return http.request({
    url: `${basic}/find_term`,
    method: 'GET',
    params,
  });
}
