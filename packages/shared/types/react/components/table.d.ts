/**
 * @description: 当前页的字段名
 */
export type PageFieldType = 'current';

/**
 * @description: 每页数量字段名
 */
export type SizeFieldType = 'size';

/**
 * @description: 接口返回的数据字段名
 */
export type ListFieldType = 'list';

/**
 * @description: 接口返回总页数字段名
 */
export type PageCountFieldType = 'pageCount' | 'pageCountNum';

/**
 * @description: 接口返回总条数字段名
 */
export type TotalFieldType = 'total';

// 分页表格返回传参
export type TablePaginationResult<T> = Record<PageFieldType, number> &
  Record<SizeFieldType, number> &
  Record<ListFieldType, T> &
  Record<TotalFieldType, number>;
