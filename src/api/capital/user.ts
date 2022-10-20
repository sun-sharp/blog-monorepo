import { AxiosCapital } from '@/api/axios';

const basic = '/user';

/**
 * @description: 获取用户信息
 */
export function getUserInfo() {
  return AxiosCapital.request({
    url: `${basic}/admin_info`,
    method: 'get',
  });
}

/**
 * @description 用户列表
 * @param params
 */
export function getPage(params) {
  return AxiosCapital.request({
    url: `${basic}/find_page`,
    method: 'POST',
    params,
  });
}

/**
 * @description 新增用户
 * @param data
 */
export const save = (data?) => {
  return AxiosCapital.request({
    url: `${basic}/save`,
    method: 'POST',
    data,
    responseOptions: {
      isShowSuccessMessage: true,
    },
  });
};

/**
 * @description 修改用户
 * @param data
 */
export const updateRoleCode = (data?) => {
  return AxiosCapital.request({
    url: `${basic}/update_role_code`,
    method: 'PUT',
    data,
    responseOptions: {
      isShowSuccessMessage: true,
    },
  });
};

/**
 * @description 修改用户基本信息
 * @param data
 */
export const updateUserInfo = (data?) => {
  return AxiosCapital.request({
    url: `${basic}/update_user_info`,
    method: 'PUT',
    data,
    responseOptions: {
      isShowSuccessMessage: true,
    },
  });
};

/**
 * @description 删除用户
 * @param userId
 */
export const remove = (userId?) => {
  return AxiosCapital.request({
    url: `${basic}/${userId}`,
    method: 'DELETE',
    responseOptions: {
      isShowSuccessMessage: true,
    },
  });
};

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
