import { AxiosBlog } from '@/api/axios';

const basic = '/user';

/**
 * @description: 获取用户信息
 */
export function getUserInfo() {
  return AxiosBlog.request({
    url: `${basic}/admin_info`,
    method: 'get',
  });
}

/**
 * @description: 用户登录
 */
export function login(params) {
  return AxiosBlog.request(
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
 * @description: 用户修改密码
 */
// export function changePassword(params, uid) {
//   return http.request(
//     {
//       url: `/user/u${uid}/changepw`,
//       method: 'POST',
//       params,
//     },
//     {
//       isTransformResponse: false,
//     }
//   );
// }

// /**
//  * @description: 用户登出
//  */
// export function logout(params) {
//   return http.request({
//     url: '/login/logout',
//     method: 'POST',
//     params,
//   });
// }
