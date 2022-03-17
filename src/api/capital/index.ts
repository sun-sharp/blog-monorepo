import { AxiosCapital } from '@/api/axios';

const basic = '';

/**
 * @description: 用户登录
 * @param params
 */
export function login(params) {
  return AxiosCapital.request(
    {
      url: `${basic}/login`,
      method: 'POST',
      params,
    },
    {
      isTransformResponse: false,
    }
  );
}

/**
 * @description 根据roleCode获取用户菜单
 * @param params
 */
export function adminMenus(params?) {
  return AxiosCapital.request({
    url: `${basic}/role_route`,
    method: 'GET',
    params,
  });
}
