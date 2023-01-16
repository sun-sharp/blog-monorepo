/*
 * @Author: YangRuiRui
 * @LastEditTime: 2023-01-16 16:06:53
 * @Description: 项目配置
 */

// 系统内置主题色列表
export const appThemeList: string[] = [
  '#2d8cf0',
  '#0960bd',
  '#0084f4',
  '#009688',
  '#536dfe',
  '#ff5c93',
  '#ee4f12',
  '#0096c7',
  '#9c27b0',
  '#ff9800',
  '#FF3D68',
  '#00C1D4',
  '#71EFA3',
  '#171010',
  '#78DEC7',
  '#1768AC',
  '#FB9300',
  '#FC5404',
];

// 动画全部类型
export const animateSetting = [
  { value: 'zoom-fade', label: '渐变' },
  { value: 'zoom-out', label: '闪现' },
  { value: 'fade-slide', label: '滑动' },
  { value: 'fade', label: '消退' },
  { value: 'fade-bottom', label: '底部消退' },
  { value: 'fade-scale', label: '缩放消退' },
];

// 表格组件配置
export const componentTable = {
  apiSetting: {
    // 当前页的字段名
    pageField: 'current',
    // 每页数量字段名
    sizeField: 'size',
    // 接口返回的数据字段名
    listField: 'list',
    // 接口返回总页数字段名
    pageCountField: 'pageCount',
    // 接口返回总条数字段名
    totalField: 'total',
  },
  //默认分页数量
  defaultPageSize: 10,
  //可切换每页数量集合
  pageSizes: [10, 20, 30, 40, 50, 100],
};

// 表格组件配置的重命名
const { apiSetting, defaultPageSize, pageSizes } = componentTable;
export const DEFAULT_PAGESIZE = defaultPageSize;
export const API_SETTING = apiSetting;
export const PAGE_SIZES = pageSizes;

// 图片上传配置
export const componentUpload = {
  //考虑接口规范不同
  apiSetting: {
    // 集合字段名
    infoField: 'result',
    // 图片地址字段名
    imgField: 'url',
  },
  //最大上传图片大小
  maxSize: 2,
  //图片上传类型
  fileType: ['image/png', 'image/jpg', 'image/jpeg', 'image/gif', 'image/svg+xml'],
};
