import { NButton } from 'naive-ui';
import { Fn } from '@vueuse/core';
export interface ActionItem extends NButton.props {
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
