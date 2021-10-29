import http from '@/api/axios';

const basic = '/dashboard';

//获取主控台信息
export function getConsoleInfo() {
  return http.request({
    url: `${basic}/console`,
    method: 'get',
  });
}
