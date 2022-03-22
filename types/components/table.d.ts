import type { TableBaseColumn } from 'naive-ui/lib/data-table/src/interface';
import { ButtonProps } from 'naive-ui';
import { Fn } from '@vueuse/core';

export type ComponentType = 'NInput' | 'NInputNumber' | 'NSelect' | 'NCheckbox' | 'NSwitch' | 'NDatePicker' | 'NTimePicker';

export interface BasicColumn extends TableBaseColumn {
  //编辑表格
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
}

export interface TableActionType {
  reload: (opt) => Promise<void>;
  emit?: any;
  getColumns: (opt?) => BasicColumn[];
  setColumns: (columns: BasicColumn[] | string[]) => void;
}

export interface BasicTableProps {
  title?: string;
  loading: boolean;
  titleTooltip?: string;
  dataSource: Function;
  columns: any[];
  pagination: object;
  showPagination: boolean;
  actionColumn: any[];
  canResize: boolean;
  resizeHeightOffset: number;
}

// 分页
export interface PaginationProps {
  page?: number;
  pageCount?: number;
  pageSize?: number;
  itemCount?: number;
  pageSizes?: number[];
  showSizePicker?: boolean;
  showQuickJumper?: boolean;
}

// 表格操作
export interface ActionItem extends ButtonProps {
  [x: string]: any;
  onClick?: Fn;
  label?: string;
  color?: string;
  icon?: string;
  popConfirm?: PopConfirm;
  disabled?: boolean;
  divider?: boolean;
  // 权限编码控制是否显示
  auth?: string | string[];
  // 业务控制是否显示
  ifShow?: boolean | ((action: ActionItem) => boolean);
}

// 更多操作
export interface PopConfirm {
  title: string;
  okText?: string;
  cancelText?: string;
  confirm: Fn;
  cancel?: Fn;
  icon?: string;
}

// 表格编辑
export type EditRecordRow<T = Recordable> = Partial<
  {
    onEdit: (editable: boolean, submit?: boolean) => Promise<boolean>;
    editable: boolean;
    onCancel: Fn;
    onSubmit: Fn;
    submitCbs: Fn[];
    cancelCbs: Fn[];
    validCbs: Fn[];
    editValueRefs: Recordable<Ref>;
  } & T
>;
