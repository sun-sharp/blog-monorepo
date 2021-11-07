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
 * @param params
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

/**
 * @description 用户列表
 * @param params
 */
export function getPage(params) {
  return AxiosBlog.request({
    url: `${basic}/find_page`,
    method: 'GET',
    params,
  });
}

/**
 * @description 新增用户
 * @param data
 */
export const save = (data?) => {
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
 * @description 修改用户
 * @param data
 */
export const update = (data?) => {
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
 * @description 删除用户
 * @param id
 */
export const remove = (id?) => {
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
