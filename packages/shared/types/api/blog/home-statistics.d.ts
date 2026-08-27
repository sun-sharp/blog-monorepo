/**
 * @description: 首页统计-账单导入类型数量
 */
export interface ApiHomeStatBillUploadTypeCount {
  // 账单导入类型(1-微信 2-支付宝 3-银行)
  type: number;
  // 类型名称
  label: string;
  // 数量
  count: number;
}

/**
 * @description: 首页统计-财务账单类型数量
 */
export interface ApiHomeStatFinancialTypeCount {
  // 账单来源(weChat-微信 aliPay-支付宝 bank-银行)
  source: string;
  // 类型名称
  label: string;
  // 数量
  count: number;
  // 子项(银行账单下为各银行明细)
  children?: ApiHomeStatFinancialTypeCount[];
}

/**
 * @description: 首页统计-图片使用来源数量
 */
export interface ApiHomeStatImageSourceCount {
  // 图片来源(user-个人用户 article-文章)
  source: string;
  // 来源名称
  label: string;
  // 数量
  count: number;
  // 子项(各图片格式类型明细)
  children?: ApiHomeStatImageTypeCount[];
}

/**
 * @description: 首页统计-图片类型数量
 */
export interface ApiHomeStatImageTypeCount {
  // 图片类型
  type: string;
  // 数量
  count: number;
}

/**
 * @description: 首页统计-尿酸血糖测量类型数量
 */
export interface ApiHomeStatUricTypeCount {
  // 测量类型(尿酸/血糖)
  type: string;
  // 数量
  count: number;
}

/**
 * @description: 首页统计数据
 */
export interface ApiHomeStatistics {
  // 财务账单总数(微信+支付宝+银行)
  financialCount: number;
  // 财务账单各类型数量
  financialTypeCount: ApiHomeStatFinancialTypeCount[];
  // 文章数
  articleCount: number;
  // 用户数
  userCount: number;
  // 角色数
  roleCount: number;
  // 菜单数
  menuCount: number;
  // 总接口数
  apiCount: number;
  // 尿酸盐糖测量总数
  uricCount: number;
  // 上传规则每个大类数量
  billUploadTypeCount: ApiHomeStatBillUploadTypeCount[];
  // 每个类型图片数量
  imageTypeCount: ApiHomeStatImageTypeCount[];
  // 图片按使用来源数量
  imageSourceCount: ApiHomeStatImageSourceCount[];
  // 尿酸血糖测量类型数量
  uricTypeCount: ApiHomeStatUricTypeCount[];
}