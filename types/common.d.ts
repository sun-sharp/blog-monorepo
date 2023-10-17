/**
 * @description 返回报文格式
 */
export interface IResponse<T = any> {
  code: number; // 0 表示成功
  result?: T;
  message: string;
}
