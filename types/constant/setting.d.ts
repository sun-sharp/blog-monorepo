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
export type PageCountFieldType = 'pageCount';

/**
 * @description: 接口返回总条数字段名
 */
export type TotalFieldType = 'total';

/**
 * @description: 表格组件配置
 */
export interface ApiSettingConst {
  pageField: PageFieldType;
  sizeField: SizeFieldType;
  listField: ListFieldType;
  pageCountField: PageCountFieldType;
  totalField: TotalFieldType;
}
