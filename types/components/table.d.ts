// import type { TableBaseColumn } from 'naive-ui/lib/data-table/src/interface';
import { ButtonProps } from 'naive-ui';
import { Fn } from '@vueuse/core';

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

export interface PopConfirm {
  title: string;
  okText?: string;
  cancelText?: string;
  confirm: Fn;
  cancel?: Fn;
  icon?: string;
}
