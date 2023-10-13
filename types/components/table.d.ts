import type { TableBaseColumn, TableSelectionColumn } from 'naive-ui/es/data-table/src/interface';
// import type { Ref } from 'vue';

export type TableColumnKey = string | number;

export type TableSizeType = 'small' | 'medium' | 'large';

export type ColumnFixedType = 'left' | 'right';

// 配置表格密度类型
export interface TableDensityOption {
  type: 'menu';
  label: string;
  key: TableSizeType;
}

// // 基础列表的列
// export type BasicTableBaseColumn<T = InternalRowData> = {
//   type?: string;
//   title?: string | ((column: BasicTableBaseColumn) => VNodeChild);
//   key: TableColumnKey;
//   render?: (rowData: T, rowIndex: number) => VNodeChild;
// } & CommonColumnInfo<T>;

// export type BasicTableSelectionColumn<T = InternalRowData> = {
//   type: 'selection';
//   key: TableColumnKey;
//   multiple?: boolean;
//   disabled?: (row: T) => boolean;
// } & CommonColumnInfo<T>;

/**
 * @description: 表格列表配置
 */
export type BasicColumn<T = InternalRowData> = TableBaseColumn<T> | (TableSelectionColumn<T> & { key: TableColumnKey });

export interface TableActionType {
  // reload: (opt) => Promise<void>;
  // emit?: (
  //   event: 'fetch-success' | 'fetch-error' | 'update:checked-row-keys' | 'edit-end' | 'edit-cancel' | 'edit-row-end' | 'edit-change',
  //   ...args: any[]
  // ) => void;
  getColumns: () => BasicColumn<T>[];
  setColumns: (columns: BasicColumn<T>[]) => void;
  getDefaultColumns: () => BasicColumn<T>[];
  getDefaultColumnsKeys: () => TableColumnKey[];
  // setCacheColumnsField: (key: string | undefined, value: Partial<BasicColumn>) => void;
}

export interface BasicTableProps {
  title?: string;
  loading: boolean;
  titleTooltip?: string;
  dataSource: Function;
  columns: BasicColumn[];
  pagination: object;
  showPagination: boolean;
  actionColumn: BasicColumn[];
  canResize: boolean;
  resizeHeightOffset: number;
}

export interface TableColumnSettingState {
  selection: boolean;
  checkAll: boolean;
  allIndeterminate: boolean;
  checkKeys: TableColumnKey[];
  defaultCheckKeys: TableColumnKey[];
}

export type TableContextInstance = TableActionType & {
  // wrapRef: Ref<Nullable<HTMLElement>>;
  // getBindValues: ComputedRef<Recordable>;
};

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

/**
 * @description: 分页
 */
export type PaginationProps = {
  // 受控模式下的当前页
  page?: number;
  // 受控模式下的分页大小
  pageSize?: number;
  // 总条数
  itemCount?: number;
  // 总页数
  pageCount?: number;
  // 是否显示每页条数的选择器
  showSizePicker?: boolean;
  // 	是否显示快速跳转
  showQuickJumper?: boolean;
  // 每页条数， 可自定义
  pageSizes?: number[];
};

/**
 * @description: 分页配置
 */
export type PaginationConfig = Partial<Record<PageCountFieldType, number>> &
  Partial<Record<PageFieldType, number>> &
  Partial<Record<TotalFieldType, number>> &
  Partial<Record<SizeFieldType, number>>;

// 分页表格传参
export type TablePaginationParams = Partial<Record<PageFieldType, number>> & Partial<Record<SizeFieldType, number>>;

// 分页表格返回传参
export type TablePaginationResult<T> = Record<PageFieldType, number> &
  Record<SizeFieldType, number> &
  Record<ListFieldType, T> &
  Record<TotalFieldType, number>;
