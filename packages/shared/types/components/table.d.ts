export type PageFieldType = 'current';
export type SizeFieldType = 'size';
export type ListFieldType = 'list';
export type TotalFieldType = 'total';
export type PageCountFieldType = 'pageCount';

export type TablePaginationResult<T> = Record<PageFieldType, number> &
  Record<SizeFieldType, number> &
  Record<ListFieldType, T> &
  Record<TotalFieldType, number>;
