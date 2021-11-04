import { AxiosBlog } from '@/api/axios';

const basic = '/role';

/**
 * @description: 角色列表
 */
export function getPage(params) {
  return AxiosBlog.request({
    url: `${basic}/role_page`,
    method: 'GET',
    params,
  });
}

/**
 * 新增角色
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
 * 修改菜单
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
 * 删除菜单
 * @param data
 */
export const removeRole = (id?) => {
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
