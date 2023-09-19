/*
 * @Author: YangRuiRui
 * @LastEditTime: 2023-09-18 17:50:50
 * @Description: 项目配置
 */

// import { ListFieldType, PageCountFieldType, PageFieldType, SizeFieldType, TotalFieldType } from '/#/components/table';

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

/**
 * 表格组件配置
 */
// 默认分页数量
// export const DEFAULT_PAGESIZE = 10;
// // 当前页的字段名
// export const PAGE_FIELD: PageFieldType = 'current';
// // 每页数量字段名
// export const SIZE_FIELD: SizeFieldType = 'size';
// // 接口返回的数据字段名
// export const LIST_FIELD: ListFieldType = 'list';
// // 接口返回总页数字段名
// export const PAGE_COUNT_FIELD: PageCountFieldType = 'pageCount';
// // 接口返回总条数字段名
// export const TOTAL_FIELD: TotalFieldType = 'total';
// // 可切换每页数量集合
// export const PAGE_SIZES: number[] = [10, 20, 30, 40, 50, 100];

// /**
//  * 图片上传配置
//  */
// export const componentUpload = {
//   //考虑接口规范不同
//   apiSetting: {
//     // 集合字段名
//     infoField: 'result',
//     // 图片地址字段名
//     imgField: 'url',
//   },
//   //最大上传图片大小
//   maxSize: 2,
//   //图片上传类型
//   fileType: ['image/png', 'image/jpg', 'image/jpeg', 'image/gif', 'image/svg+xml'],
// };
