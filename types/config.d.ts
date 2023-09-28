// env 配置
export interface GlobConfig {
  baseUrl: string;
  title: string;
  capitalApiUrl: string;
  blogApiUrl: string;
  shortName: string;
  urlPrefix?: string;
  imgUrl?: string;
  tokenHead?: string;
}

// 下拉选择器的参数
export interface CNumOption {
  value: number;
  label: string;
}

// 下拉选择器的参数
export interface CStrOption {
  value: string;
  label: string;
}
