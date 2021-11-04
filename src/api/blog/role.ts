import { AxiosBlog } from '@/api/axios';

const basic = '/role';
/**
 * @description: 角色列表
 */
export function getRolePage(params) {
  return AxiosBlog.request({
    url: `${basic}/role_page`,
    method: 'GET',
    params,
  });
}
