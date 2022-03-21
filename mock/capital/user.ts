import Mock from 'mockjs';
import { resultError, resultSuccess } from '../_util';

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
    statusCode: 401,
    response: () => {
      return resultError('用户没有权限（令牌、用户名、密码错误）!', { code: 401 });
      // const token = getRequestToken(request);
      // if (!token) return resultError('Invalid token');
      // return resultSuccess(adminInfo);
    },
  },
];
