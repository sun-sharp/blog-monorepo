export type TableDensityOptionKey = 'large' | 'medium' | 'small';

// 配置表格密度类型
export interface TableDensityOption {
  type: 'menu';
  label: string;
  key: TableDensityOptionKey;
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
