// import type { ButtonProps, TableBaseColumn } from 'naive-ui';
// import type { Fn } from '@vueuse/core';
// import type { Ref } from 'vue';

/**
 * @description: 组件
 */
export type ComponentType = 'NInput' | 'NInputNumber' | 'NSelect' | 'NCheckbox' | 'NSwitch' | 'NDatePicker' | 'NTimePicker';

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
export type PageCountFieldType = 'pageCount';

/**
 * @description: 接口返回总条数字段名
 */
export type TotalFieldType = 'total';

// /**
//  * @description: 表格列表配置
//  */
// export interface BasicColumn extends TableBaseColumn {
//   // 是否编辑表格
//   edit?: boolean;
//   editRow?: boolean;
//   editable?: boolean;
//   editComponent?: ComponentType;
//   editComponentProps?: Recordable;
//   editRule?: boolean | ((text: string, record: Recordable) => Promise<string>);
//   editValueMap?: (value: any) => string;
//   onEditRow?: () => void;
//   // 权限编码控制是否显示
//   auth?: string[];
//   // 业务控制是否显示
//   ifShow?: boolean | ((column: BasicColumn) => boolean);
// }

// export interface TableActionType {
//   reload: (opt) => Promise<void>;
//   emit?: any;
//   getColumns: (opt?) => BasicColumn[];
//   setColumns: (columns: BasicColumn[] | string[]) => void;
// }

// export interface BasicTableProps {
//   title?: string;
//   loading: boolean;
//   titleTooltip?: string;
//   dataSource: Function;
//   columns: any[];
//   pagination: object;
//   showPagination: boolean;
//   actionColumn: any[];
//   canResize: boolean;
//   resizeHeightOffset: number;
// }

// export type PaginationPropsType = PageCountFieldType | ListFieldType | SizeFieldType | PageFieldType | TotalFieldType;

// /**
//  * @description: 分页
//  */
// export type PaginationProps = {
//   page?: number;
//   size?: number;
//   list?: number;
//   total?: number;
//   pageCount?: number;
//   showSizePicker?: boolean;
//   showQuickJumper?: boolean;
//   pageSizes?: number[];
// };

// // 分页传参
// export interface PaginationParams {
//   current?: number;
//   size?: number;
// }

// // 分页传参
// export interface PaginationResult {
//   current: number;
//   list: any[];
//   size: number;
//   total: number;
// }

// // 表格操作
// export interface ActionItem extends ButtonProps {
//   [x: string]: any;
//   onClick?: Fn;
//   label?: string;
//   color?: string;
//   icon?: string;
//   popConfirm?: PopConfirm;
//   disabled?: boolean;
//   divider?: boolean;
//   // 权限编码控制是否显示
//   auth?: string | string[];
//   // 业务控制是否显示
//   ifShow?: boolean | ((action: ActionItem) => boolean);
// }

// // 更多操作
// export interface PopConfirm {
//   title: string;
//   okText?: string;
//   cancelText?: string;
//   confirm: Fn;
//   cancel?: Fn;
//   icon?: string;
// }

// // 表格编辑
// export type EditRecordRow<T = Recordable> = Partial<
//   {
//     onEdit: (editable: boolean, submit?: boolean) => Promise<boolean>;
//     editable: boolean;
//     onCancel: Fn;
//     onSubmit: Fn;
//     submitCbs: Fn[];
//     cancelCbs: Fn[];
//     validCbs: Fn[];
//     editValueRefs: Recordable<Ref>;
//   } & T
// >;
