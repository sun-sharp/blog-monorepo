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
  size?: number;
  // 第几页
  current?: number;
}

/**
 * @description: 开始结束时间传参
 */
export interface ApiStartEndTimeParams {
  // 开始时间
  startTime: string;

  // 结束时间
  endTime: string;
}

// ============ 字段配置类型 ============
export interface FieldConfig {
  label: string;
  type: 'string' | 'number' | 'date';
}

// 方法1：定义通用工具类（推荐，可复用）
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
