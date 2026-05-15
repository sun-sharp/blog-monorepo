import { VNode } from 'vue';

// 图标组件
export interface IconsType {
  [x: string]: Component;
}

// html图标
export interface RenderIconType {
  [x: string]: VNode;
}

// Antd 图标
export interface UtilsIconOptions {
  value: string;
  label: VNode;
}
