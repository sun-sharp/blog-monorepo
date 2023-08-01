/**
 * @description 返回报文格式
 */
export interface IResponse {
  code: number; // 0 表示成功
  result?: any;
  message: string;
}
