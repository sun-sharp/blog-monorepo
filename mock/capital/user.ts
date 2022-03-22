import Mock from 'mockjs';
import {
  doCustomTimes,
  // resultError,
  resultSuccess,
} from '../_util';

const Random = Mock.Random;

const token = Random.string('upper', 32, 32);

const basic = '/capital-api/user';

const adminInfo = {
  userId: '617551d8e809524e0c005bf2',
  roleCode: 'manager',
  loginDate: '2022-01-21 22:51:49',
  username: 'yrr',
  avatar: Random.image(),
  name: 'yrr',
};

const userList = (size) => {
  const result: any[] = [];
  doCustomTimes(size, () => {
    result.push({
      userId: '@integer(10,100)',
      roleCode: '@word(5)',
      loginDate: '2022-01-21 22:51:49',
      username: '@cname()',
      avatar: Random.image(),
      name: '@cname()',
    });
  });
  return result;
};

export default [
  {
    url: `${basic}/login`,
    timeout: 1000,
    method: 'post',
    response: () => {
      return resultSuccess({ token });
    },
  },
  {
    url: `${basic}/admin_info`,
    timeout: 1000,
    method: 'get',
    // statusCode: 401,
    response: () => {
      // return resultError('用户没有权限（令牌、用户名、密码错误）!', { code: 401 });
      // const token = getRequestToken(request);
      // if (!token) return resultError('Invalid token');
      return resultSuccess(adminInfo);
    },
  },
  {
    url: `${basic}/find_page`,
    timeout: 1000,
    method: 'post',
    response: ({ query }) => {
      const { current = 1, size = 10 } = query;
      const list = userList(Number(size));
      return resultSuccess({
        current: Number(current),
        list,
        size: Number(size),
        total: 60,
      });
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
    url: `${basic}/update_role_code`,
    timeout: 1000,
    method: 'put',
    response: () => {
      return resultSuccess(null, { message: '修改成功!' });
    },
  },
];
