// 头部面包屑
export interface HeaderBreadcrumbItem {
  label: unknown | string;
  key: RouteRecordName;
  icon: unknown | string;
  disabled: boolean;
  children?: HeaderBreadcrumbItem[];
}
