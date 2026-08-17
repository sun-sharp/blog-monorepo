import { exec } from 'node:child_process';
import { promisify } from 'node:util';
import { Injectable } from '@nestjs/common';
import { ApiCode } from 'src/common/enums/api-code.enum';
import { logger } from 'src/common/journal';
import { IResponse } from '/#/common/common';

const execAsync = promisify(exec);

/**
 * @description: pm2 进程信息
 */
export interface Pm2ProcessInfo {
  // pm2 进程 id
  pid: number;
  // pm2 进程名称
  name: string;
  // 进程 npm 名
  namespace: string;
  // 运行状态 online/stopped/errored
  status: string;
  // cpu 使用率
  cpu: string;
  // 内存使用率
  memory: string;
  // 重启次数
  restarts: string;
  // 运行时长
  uptime: string;
  // 启动时间
  createdTime: string;
}

@Injectable()
export class Pm2LogService {
  /**
   * @description: 执行 pm2 命令
   * @param {string} command
   * @return {Promise<string>}
   */
  private runPm2Command(command: string): Promise<string> {
    return new Promise((resolve, reject) => {
      execAsync(command, { maxBuffer: 10 * 1024 * 1024 })
        .then(({ stdout }) => resolve(stdout))
        .catch((err) => reject(new Error(`${err.message}`)));
    });
  }

  /**
   * @description: 获取 pm2 进程列表
   * @return {Promise<Pm2ProcessInfo[]>}
   */
  public async listProcesses(): Promise<Pm2ProcessInfo[]> {
    try {
      logger.log(`pm2 jlist 命令开始执行`);
      // 用 json 输出避免解析文本格式差异
      const stdout = await this.runPm2Command('pm2 jlist');
      let list: any[] = [];
      try {
        list = JSON.parse(stdout) || [];
      } catch (err) {
        // 某些 pm2 版本在无进程时会输出空，尝试读取
        if (String(stdout).trim() === '') {
          list = [];
        } else {
          throw err;
        }
      }
      logger.log(`获取 pm2 进程列表 成功！`);
      const result: Pm2ProcessInfo[] = (list || []).map((m) => {
        const monit = m?.monit || {};
        return {
          pid: Number(m?.pid) || 0,
          name: m?.name || m?.pm2_env?.name || '',
          namespace: m?.pm2_env?.namespace || '',
          status: m?.pm2_env?.status || '',
          cpu: `${monit.cpu ?? 0}%`,
          memory: this.formatMemory(monit.memory ?? 0),
          restarts: String(m?.pm2_env?.restart_time ?? 0),
          uptime: this.formatUptime(m?.pm2_env?.pm_uptime),
          createdTime: m?.pm2_env?.pm2_env?.created_at || m?.pm2_env?.created_at || m?.created_at || '',
        };
      });
      return result;
    } catch (err) {
      logger.error(`获取 pm2 进程列表 失败！${err}`);
      return [];
    }
  }

  /**
   * @description: 获取指定进程的日志
   * @param {string} name 进程名
   * @param {number} lines 行数
   * @param {string} type out | error | all
   * @return {Promise<IResponse>}
   */
  public async getLog(name: string, lines: number, type: string): Promise<IResponse> {
    try {
      if (!name) {
        throw '进程名不能为空';
      }
      const line = Number(lines) && Number(lines) > 0 ? Number(lines) : 200;
      const validType = type === 'out' || type === 'error' ? type : 'out+err';
      // pm2 logs 默认不输出内容到 stdout，需要 --nostream --raw
      const command = `pm2 logs ${name} --lines ${line} --nostream --raw 2>&1`;
      const stdout = await this.runPm2Command(command);
      // 按输出类型过滤
      let content = stdout;
      if (type === 'out') {
        content = stdout
          .split('\n')
          .filter((l) => !l.startsWith(`${name}-error`) && !/error out|错误|Error/.test(l))
          .join('\n');
      } else if (type === 'error') {
        content = stdout
          .split('\n')
          .filter((l) => l.startsWith(`${name}-error`) || /error|\错误|Error/.test(l))
          .join('\n');
      }
      return {
        code: ApiCode.SUCCESS,
        result: { name, lines: line, type: validType, content },
        message: '查询成功！',
      };
    } catch (err) {
      logger.error(`获取 pm2 日志 失败！${err}`);
      return {
        code: ApiCode.ERROR,
        message: `${err}` || '查询失败！',
      };
    }
  }

  /**
   * @description: 内存格式化
   */
  private formatMemory(bytes: number): string {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  /**
   * @description: 运行时长格式化
   * @param {number} uptime 启动时间戳
   */
  private formatUptime(uptime?: number): string {
    if (!uptime) return '';
    const diff = Date.now() - Number(uptime);
    if (diff <= 0) return '刚刚';
    const s = Math.floor(diff / 1000);
    if (s < 60) return `${s}秒`;
    const m = Math.floor(s / 60);
    if (m < 60) return `${m}分钟`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}小时${m % 60}分钟`;
    const d = Math.floor(h / 24);
    return `${d}天${h % 24}小时`;
  }
}
