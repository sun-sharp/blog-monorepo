import Mock from 'mockjs';
import { resultSuccess } from '../_util';

const Random = Mock.Random;

const token = Random.string('upper', 32, 32);

const basic = '/mock-api/user';

const adminInfo = {
  userId: '1',
  username: 'admin',
  realName: 'Admin',
  avatar: Random.image(),
  desc: 'manager',
  password: Random.string('upper', 4, 16),
  token,
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
    response: () => {
      // const token = getRequestToken(request);
      // if (!token) return resultError('Invalid token');
      return resultSuccess(adminInfo);
    },
  },
];
