import http from '@/utils/http/axios';

const basic = '/blog/dashboard';

//获取主控台信息
export function getConsoleInfo() {
  return http.request({
    url: `${basic}/console`,
    method: 'get',
  });
}
