// env 配置
export interface GlobConfig {
  baseUrl: string;
  title: string;
  capitalApiUrl: string;
  blogApiUrl: string;
  shortName: string;
  tokenHead?: string;
}

// 选择数字的参数
export interface CNumOption {
  value: number;
  label: string;
}

// 选择字符串的参数
export interface CStrOption {
  value: string;
  label: string;
}

// 选择的参数
export interface CTypeOption<T> {
  value: T;
  label: string;
}
