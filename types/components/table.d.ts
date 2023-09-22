export type TableDensityOptionKey = 'large' | 'medium' | 'small';

// 配置表格密度类型
export interface TableDensityOption {
  type: 'menu';
  label: string;
  key: TableDensityOptionKey;
}
