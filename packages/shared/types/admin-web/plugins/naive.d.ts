/**
 * @description: Naive菜单的数据对象类型
 */
export interface NaiveMenuOption {
  // 子选项
  children?: NaiveMenuOption[];
  // 是否禁用菜单项
  disabled?: boolean;
  // 菜单项的额外部分
  extra?: string | (() => VNodeChild);
  // 菜单项的图标
  icon?: () => VNode;
  // 菜单项的标识符
  key: string;
  // 菜单项的内容
  label: string | (() => VNodeChild);
  // 是否显示菜单项
  show?: boolean;
  // path
  path: string;
}
