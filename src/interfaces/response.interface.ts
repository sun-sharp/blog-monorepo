/**
 * @description 返回报文格式
 * @date 21/11/2021
 * @export
 * @interface IResponse
 */
export interface IResponse {
  code: number; // 0 表示成功
  result?: any;
  message: any;
}
