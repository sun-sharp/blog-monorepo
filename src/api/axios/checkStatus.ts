import { PAGE_ENUM } from '@/constant';
import router from '@/router';
import { storage } from '@/utils/storage';

export const checkStatus = (status: number, msg: string, messageFun: Function): void => {
  switch (status) {
    case 400:
      messageFun('error', `${msg || '请求参数有误！'}`);
      break;
    // 401: 未登录
    // 未登录则跳转登录页面，并携带当前页面的路径
    // 在登录成功后返回当前页面，这一步需要在登录页操作。
    case 401:
      messageFun('error', msg || '用户没有权限（令牌、用户名、密码错误）!');
      const LoginName = PAGE_ENUM.LOGIN_NAME;
      storage.clear();
      router.replace({
        name: LoginName,
        query: {
          redirect: router.currentRoute.value.fullPath,
        },
      });
      break;
    case 403:
      messageFun('error', msg || '用户得到授权，但是访问是被禁止的。!');
      break;
    // 404请求不存在
    case 404:
      messageFun('error', msg || '网络请求错误,未找到该资源!');
      break;
    case 405:
      messageFun('error', msg || '网络请求错误,请求方法未允许!');
      break;
    case 408:
      messageFun('error', msg || '网络请求超时!');
      break;
    case 500:
      messageFun('error', msg || '服务器错误,请联系管理员!');
      break;
    case 501:
      messageFun('error', msg || '网络未实现!');
      break;
    case 502:
      messageFun('error', msg || '网络错误!');
      break;
    case 503:
      messageFun('error', msg || '服务不可用，服务器暂时过载或维护!');
      break;
    case 504:
      messageFun('error', msg || '网络超时!');
      break;
    case 505:
      messageFun('error', msg || 'http版本不支持该请求!');
      break;
    default:
      messageFun('error', msg);
  }
};
