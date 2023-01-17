import { AxiosCapital } from '@/api/axios';

const basic = '';

/**
 * @description: 用户登录
 * @param data
 */
export function login(data) {
  return AxiosCapital.request({
    url: `${basic}/login`,
    method: 'POST',
    data,
    responseOptions: {
      isTransformResponse: false,
    },
  });
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

/**
 * @description 注册用户
 * @param data
 */
export function signUp(data?) {
  return AxiosCapital.request({
    url: `${basic}/sign_up`,
    method: 'POST',
    data,
    responseOptions: {
      isTransformResponse: false,
    },
  });
}

/**
 * @description 删除用户和用户相关数据
 * @param userId
 */
export function removeUser(userId: string) {
  return AxiosCapital.request({
    url: `${basic}/remove_user/${userId}`,
    method: 'DELETE',
    responseOptions: {
      isShowSuccessMessage: true,
    },
  });
}
