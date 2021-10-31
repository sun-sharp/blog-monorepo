import http from '@/api/axios';

const basic = '/role';
/**
 * @description: 角色列表
 */
export function getRoleList(params) {
  return http.request({
    url: `${basic}/list`,
    method: 'GET',
    params,
  });
}
