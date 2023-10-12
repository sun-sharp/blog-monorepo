import { ListFieldType, PageCountFieldType, PageFieldType, SizeFieldType, TableDensityOption, TotalFieldType } from '/#/components/table';

// 配置表格密度
export const densityOptions: TableDensityOption[] = [
  {
    type: 'menu',
    label: '紧凑',
    key: 'small',
  },
  {
    type: 'menu',
    label: '默认',
    key: 'medium',
  },
  {
    type: 'menu',
    label: '宽松',
    key: 'large',
  },
];

/**
 * 表格组件配置
 */
// 默认分页数量
export const DEFAULT_PAGESIZE = 10;
// 当前页的字段名
export const PAGE_FIELD: PageFieldType = 'current';
// 每页数量字段名
export const SIZE_FIELD: SizeFieldType = 'size';
// 接口返回的数据字段名
export const LIST_FIELD: ListFieldType = 'list';
// 接口返回总页数字段名
export const PAGE_COUNT_FIELD: PageCountFieldType = 'pageCount';
// 接口返回总条数字段名
export const TOTAL_FIELD: TotalFieldType = 'total';
// 可切换每页数量集合
export const PAGE_SIZES: number[] = [10, 20, 30, 40, 50, 100];
