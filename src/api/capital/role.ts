import { AxiosCapital } from '@/api/axios';

const basic = '/role';

/**
 * @description 分页查询角色列表
 * @param params
 */
export function getPage(params) {
  return AxiosCapital.request({
    url: `${basic}/role_page`,
    method: 'GET',
    params,
  });
}

/**
 * @description 查询全部角色列表
 * @param params
 */
export function getAll(params?) {
  return AxiosCapital.request({
    url: `${basic}/all`,
    method: 'GET',
    params,
  });
}

/**
 * @description 新增角色
 * @param data
 */
export const save = (data?) => {
  return AxiosCapital.request(
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
 * @description 修改角色
 * @param data
 */
export const update = (data?) => {
  return AxiosCapital.request(
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
 * @description 删除角色
 * @param id
 */
export const remove = (id?) => {
  return AxiosCapital.request(
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
