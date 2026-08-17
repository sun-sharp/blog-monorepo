import { pm2LogRequest } from '../utils/request';

export interface Pm2ProcessInfo {
  pid: number;
  name: string;
  namespace: string;
  status: string;
  cpu: string;
  memory: string;
  restarts: string;
  uptime: string;
  createdTime: string;
}

export interface Pm2LogResult {
  name: string;
  lines: number;
  type: string;
  content: string;
}

const basic = '';

export const listProcesses = (): Promise<Pm2ProcessInfo[]> => {
  return pm2LogRequest({
    url: `${basic}/processes`,
    method: 'GET',
  });
};

export const getLog = (name: string, lines = 200, type = 'all'): Promise<Pm2LogResult> => {
  return pm2LogRequest({
    url: `${basic}/log`,
    method: 'POST',
    data: { name, lines, type },
    showLoading: false,
    timeout: 60000,
  });
};
