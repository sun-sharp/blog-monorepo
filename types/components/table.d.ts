import { TableBaseColumn, ColumnKey } from 'naive-ui/es/data-table/src/interface';
// import type { Ref } from 'vue';

export type TableSizeType = 'small' | 'medium' | 'large';

export type ColumnFixedType = boolean | 'left' | 'right';

// 配置表格密度类型
export interface TableDensityOption {
  type: 'menu';
  label: string;
  key: TableSizeType;
}

/**
 * @description: 表格列表配置
 */
export type BasicColumn = TableBaseColumn & {
  // 是否编辑表格
  edit?: boolean;
  editRow?: boolean;
  editable?: boolean;
  editComponent?: ComponentType;
  editComponentProps?: Recordable;
  editRule?: boolean | ((text: string, record: Recordable) => Promise<string>);
  editValueMap?: (value: any) => string;
  onEditRow?: () => void;
  // 权限编码控制是否显示
  auth?: string[];
  // 业务控制是否显示
  ifShow?: boolean | ((column: BasicColumn) => boolean);
};

export interface TableActionType {
  // reload: (opt) => Promise<void>;
  // emit?: (
  //   event: 'fetch-success' | 'fetch-error' | 'update:checked-row-keys' | 'edit-end' | 'edit-cancel' | 'edit-row-end' | 'edit-change',
  //   ...args: any[]
  // ) => void;
  getColumns: (opt?) => BasicColumn[];
  setColumns: (columns: BasicColumn[] | string[]) => void;
  getCacheColumns: () => BasicColumn[];
  getCacheColumnsKeys: () => string[];
  setCacheColumnsField: (key: string | undefined, value: Partial<BasicColumn>) => void;
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
  checkList: ColumnKey[];
  defaultCheckList: ColumnKey[];
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
  page?: number;
  size?: number;
  list?: number;
  total?: number;
  pageCount?: number;
  showSizePicker?: boolean;
  showQuickJumper?: boolean;
  pageSizes?: number[];
};

/**
 * @description: 分页配置
 */
export type PaginationConfig = Partial<Record<PageCountFieldType, number>> & Partial<Record<PageFieldType, number>> & Partial<Record<TotalFieldType, number>>;

// 分页表格传参
export type TablePaginationParams = Partial<Record<PageFieldType, number>> & Partial<Record<SizeFieldType, number>>;

// 分页表格返回传参
export type TablePaginationResult = Record<PageFieldType, number> &
  Record<SizeFieldType, number> &
  Record<ListFieldType, any[]> &
  Record<TotalFieldType, number>;
