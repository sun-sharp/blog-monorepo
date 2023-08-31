import type { RouteRecordRaw, RouteMeta } from 'vue-router';
import { defineComponent } from 'vue';
import { RouteLocationNormalized } from 'vue-router';

export type Component<T = any> = ReturnType<typeof defineComponent> | (() => Promise<typeof import('*.vue')>) | (() => Promise<T>);

export interface AppRouteRecordRaw extends Omit<RouteRecordRaw, 'children'> {
  path: string;
  name?: string;
  meta?: RouteMeta;
  component?: Component | string;
  children?: AppRouteRecordRaw[];
}

export interface Meta {
  // 名称
  title: string;
  // 是否忽略权限
  ignoreAuth?: boolean;
  // 是否不缓存
  noKeepAlive?: boolean;
  // 是否固定在tab上
  affix?: boolean;
  // tab上的图标
  icon?: string;
  // 跳转地址
  iframeSrc?: string;
  // 外链跳转地址
  externalLink?: string;
  //隐藏
  hidden?: boolean;
}

export type RouteItem = Partial<RouteLocationNormalized> & {
  fullPath: string;
  name: string;
};

export interface MenuType {
  component: string;
  hidden: Boolean;
  icon: string;
  iframeSrc?: string;
  menuId: string;
  menuType: number;
  name: string;
  parentId: string;
  sort: number;
  title: string;
}
