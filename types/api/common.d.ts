/**
 * @description 返回报文格式
 */
export interface ApiResponse<T> {
  // 0 表示成功
  code: number;
  result?: T;
  message: string;
}

/**
 * @description: 分页参数
 */
export interface ApiPaginateParams {
  // 每页多少个
  size: number;
  // 第几页
  current: number;
}
