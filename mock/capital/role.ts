import { resultSuccess, doCustomTimes } from '../_util';

const basic = '/capital-api/role';

const roleList = (size) => {
  const result: any[] = [];
  doCustomTimes(size, () => {
    result.push({
      roleId: '@integer(10,100)',
      name: '@cname()',
      roleCode: '@word(5)',
      roleType: '@integer(1,2)',
      permission: ['system', 'menu', 'image'],
    });
  });
  return result;
};

export default [
  {
    url: `${basic}/role_page`,
    timeout: 1000,
    method: 'post',
    response: ({ query }) => {
      const { current = 1, size = 10 } = query;
      const list = roleList(Number(size));
      return resultSuccess({
        current: Number(current),
        list,
        size: Number(size),
        total: 60,
      });
    },
  },
  {
    url: `${basic}/all`,
    timeout: 1000,
    method: 'get',
    response: () => {
      return resultSuccess(roleList(20));
    },
  },
  {
    url: `${basic}/save`,
    timeout: 1000,
    method: 'post',
    response: () => {
      return resultSuccess(null, { message: '保存成功！' });
    },
  },
  {
    url: `${basic}/update`,
    timeout: 1000,
    method: 'put',
    response: () => {
      return resultSuccess(null, { message: '修改成功!' });
    },
  },
];
