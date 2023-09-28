/*
 * @Author: YangRuiRui
 * @LastEditTime: 2023-09-28 17:07:47
 * @Description: 项目配置
 */

import navThemeDarkImage from '@/assets/images/setting/nav-theme-dark.svg';
// import navHorizontalImage from '@/assets/images/setting/nav-horizontal.svg';
// import navHorizontalMixImage from '@/assets/images/setting/nav-horizontal-mix.svg';
import navThemeLightImage from '@/assets/images/setting/nav-theme-light.svg';
import headerThemeDarkImage from '@/assets/images/setting/header-theme-dark.svg';
import { ApiAppTheme } from '/#/api/configuration';
import { CTypeOption } from '/#/config';

// 系统主题类型列表
export const appThemeList: CTypeOption<ApiAppTheme>[] = [
  {
    label: '浅色',
    value: 'light',
  },
  {
    label: '深色',
    value: 'dark',
  },
];

// 系统内置主题色列表
export const appThemeColorList: string[] = ['#2d8cf0', '#009688', '#536dfe', '#ff5c93', '#ee4f12', '#0096c7', '#9c27b0', '#ff9800', '#FF3D68'];

// 切换菜单模式
export const navModeArr = [
  {
    title: '左侧菜单模式',
    name: 'vertical',
  },
  {
    title: '顶部菜单模式',
    name: 'horizontal',
  },
  {
    title: '顶部菜单混合模式',
    name: 'horizontal-mix',
  },
];

// 设置导航风格
export const navThemeArr = [
  {
    title: '暗色侧边栏',
    name: 'dark',
    image: navThemeDarkImage,
  },
  {
    title: '白色侧边栏',
    name: 'light',
    image: navThemeLightImage,
  },
  {
    title: '暗色顶栏',
    name: 'header-dark',
    image: headerThemeDarkImage,
  },
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

/**
 * 图片上传配置
 */
export const COMPONENT_UPLOAD = {
  // 集合字段名
  apiInfoField: 'result',
  // 图片地址字段名
  apiImgField: 'url',
  //最大上传图片大小
  maxSize: 2,
  //图片上传类型
  fileType: ['image/png', 'image/jpg', 'image/jpeg', 'image/gif', 'image/svg+xml'],
};

// 设置导航风格
export const sidebarStyleArr = [
  {
    title: '暗',
    name: 'dark',
  },
  {
    title: '白',
    name: 'light',
  },
];

// 设置导航风格
export const topBarStyleArr = [
  {
    title: '暗',
    name: 'dark',
  },
  {
    title: '白',
    name: 'light',
  },
];
