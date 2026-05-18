/*
 * @Author: YangRuiRui
 * @LastEditTime: 2026-05-16 09:14:25
 * @Description: 项目配置
 */

import navThemeDarkImage from '@/assets/images/setting/nav-theme-dark.svg';
// import navHorizontalImage from '@/assets/images/setting/nav-horizontal.svg';
// import navHorizontalMixImage from '@/assets/images/setting/nav-horizontal-mix.svg';
import navThemeLightImage from '@/assets/images/setting/nav-theme-light.svg';
import headerThemeDarkImage from '@/assets/images/setting/header-theme-dark.svg';
import { ApiAnimate, ApiAppTheme } from '/#/api/configuration';
import { ThemeCommonVars } from 'naive-ui';
import { CTypeOption } from '/#/common/config';

// 默认layout的高度和宽度
export const defaultLayoutSize = {
  headerHeight: 64,
  tabsViewHeight: 44,
  footerHeight: 44,
  mainViewPadding: 10,
};

// 默认variable样式
export const defaultVariable = {
  themeColor: '#2d8cf0',
  headerBackColor: '#f8f8f8',
  headerTextColor: '#333639',
  siderBackColor: '#f8f8f8',
  siderTextColor: '#333639',
  footerBackColor: '#f8f8f8',
  footerTextColor: '#333639',
  tabsViewBackColor: '#f0f0f0',
  tabsViewBtnBackColor: '#ffffff',
  tabsViewBtnTextColor: '#333639',
  tabsViewBtnActiveBackColor: '#ffffff',
  backgroundColor: '#f5f7fa',
  fontColor: '#333333',
  scrollbarThumbBackColor: '#dddddd',
  scrollbarThumbHoverBackColor: '#bbbbbb',
  scrollbarTrackPieceBackColor: '#f8f8f8',
  cardBackgroundColor: '#ffffff',
  cardBoxShadow: '0 1px 2px -2px rgba(0, 0, 0, .08), 0 3px 6px 0 rgba(0, 0, 0, .06), 0 5px 12px 4px rgba(0, 0, 0, .04)',
  cardBorderRadius: '8px',
  cardBorderColor: '#cccccc',
  borderDivideColor: 'rgb(239, 239, 245)',
  borderInputColor: '#e0e0e6',
  textWarningColor: '#ff6767',
};
// 默认naive组件主题
export const defaultNaiveTheme: ThemeCommonVars = {
  actionColor: 'rgb(250, 250, 252)',
  avatarColor: 'rgba(204, 204, 204, 1)',
  baseColor: '#fff',
  bodyColor: '#fff',
  borderColor: 'rgb(224, 224, 230)',
  borderRadius: '3px',
  borderRadiusSmall: '2px',
  boxShadow1: '0 1px 2px -2px rgba(0, 0, 0, .08), 0 3px 6px 0 rgba(0, 0, 0, .06), 0 5px 12px 4px rgba(0, 0, 0, .04)',
  boxShadow2: '0 3px 6px -4px rgba(0, 0, 0, .12), 0 6px 16px 0 rgba(0, 0, 0, .08), 0 9px 28px 8px rgba(0, 0, 0, .05)',
  boxShadow3: '0 6px 16px -9px rgba(0, 0, 0, .08), 0 9px 28px 0 rgba(0, 0, 0, .05), 0 12px 48px 16px rgba(0, 0, 0, .03)',
  buttonColor2: 'rgba(46, 51, 56, .05)',
  buttonColor2Hover: 'rgba(46, 51, 56, .09)',
  buttonColor2Pressed: 'rgba(46, 51, 56, .13)',
  cardColor: '#fff',
  clearColor: 'rgba(194, 194, 194, 1)',
  clearColorHover: 'rgba(146, 146, 146, 1)',
  clearColorPressed: 'rgba(175, 175, 175, 1)',
  closeColorHover: 'rgba(0, 0, 0, .09)',
  closeColorPressed: 'rgba(0, 0, 0, .13)',
  closeIconColor: 'rgba(102, 102, 102, 1)',
  closeIconColorHover: 'rgba(102, 102, 102, 1)',
  closeIconColorPressed: 'rgba(102, 102, 102, 1)',
  codeColor: 'rgb(244, 244, 248)',
  cubicBezierEaseIn: 'cubic-bezier(.4, 0, 1, 1)',
  cubicBezierEaseInOut: 'cubic-bezier(.4, 0, .2, 1)',
  cubicBezierEaseOut: 'cubic-bezier(0, 0, .2, 1)',
  dividerColor: 'rgb(239, 239, 245)',
  errorColor: '#d03050',
  errorColorHover: '#de576d',
  errorColorPressed: '#ab1f3f',
  errorColorSuppl: '#de576d',
  fontFamily: 'v-sans, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
  fontFamilyMono: 'v-mono, SFMono-Regular, Menlo, Consolas, Courier, monospace',
  fontSize: '14px',
  fontSizeHuge: '16px',
  fontSizeLarge: '15px',
  fontSizeMedium: '14px',
  fontSizeMini: '12px',
  fontSizeSmall: '14px',
  fontSizeTiny: '12px',
  fontWeight: '400',
  fontWeightStrong: '500',
  heightHuge: '46px',
  heightLarge: '40px',
  heightMedium: '34px',
  heightMini: '16px',
  heightSmall: '28px',
  heightTiny: '22px',
  hoverColor: 'rgb(243, 243, 245)',
  iconColor: 'rgba(194, 194, 194, 1)',
  iconColorDisabled: 'rgba(209, 209, 209, 1)',
  iconColorHover: 'rgba(146, 146, 146, 1)',
  iconColorPressed: 'rgba(175, 175, 175, 1)',
  infoColor: '#2080f0',
  infoColorHover: '#4098fc',
  infoColorPressed: '#1060c9',
  infoColorSuppl: '#4098fc',
  inputColor: 'rgba(255, 255, 255, 1)',
  inputColorDisabled: 'rgb(250, 250, 252)',
  invertedColor: 'rgb(0, 20, 40)',
  lineHeight: '1.6',
  modalColor: '#fff',
  name: 'common',
  opacity1: '0.82',
  opacity2: '0.72',
  opacity3: '0.38',
  opacity4: '0.24',
  opacity5: '0.18',
  opacityDisabled: '0.5',
  placeholderColor: 'rgba(194, 194, 194, 1)',
  placeholderColorDisabled: 'rgba(209, 209, 209, 1)',
  popoverColor: '#fff',
  pressedColor: 'rgb(237, 237, 239)',
  primaryColor: '#18a058',
  primaryColorHover: '#36ad6a',
  primaryColorPressed: '#0c7a43',
  primaryColorSuppl: '#36ad6a',
  progressRailColor: 'rgba(235, 235, 235, 1)',
  railColor: 'rgb(219, 219, 223)',
  scrollbarBorderRadius: '5px',
  scrollbarColor: 'rgba(0, 0, 0, 0.25)',
  scrollbarColorHover: 'rgba(0, 0, 0, 0.4)',
  scrollbarHeight: '5px',
  scrollbarWidth: '5px',
  successColor: '#18a058',
  successColorHover: '#36ad6a',
  successColorPressed: '#0c7a43',
  successColorSuppl: '#36ad6a',
  tabColor: 'rgb(247, 247, 250)',
  tableColor: '#fff',
  tableColorHover: 'rgba(0, 0, 100, 0.03)',
  tableColorStriped: 'rgba(0, 0, 100, 0.02)',
  tableHeaderColor: 'rgb(250, 250, 252)',
  tagColor: '#eee',
  textColor1: 'rgb(31, 34, 37)',
  textColor2: 'rgb(51, 54, 57)',
  textColor3: 'rgb(118, 124, 130)',
  textColorBase: '#fff',
  textColorDisabled: 'rgba(194, 194, 194, 1)',
  warningColor: '#f0a020',
  warningColorHover: '#fcb040',
  warningColorPressed: '#c97c10',
  warningColorSuppl: '#fcb040',
};

// 暗色variable样式
export const darkVariable = {
  headerBackColor: '#001428',
  headerTextColor: '#ffffff',
  siderBackColor: '#001428',
  siderTextColor: '#ffffff',
  footerBackColor: '#001428',
  footerTextColor: '#ffffff',
  tabsViewBackColor: '#333333',
  tabsViewBtnBackColor: '#001428',
  tabsViewBtnTextColor: '#ffffff',
  tabsViewBtnActiveTextColor: '#ffffff',
  backgroundColor: '#222222',
  fontColor: '#fff',
  scrollbarThumbBackColor: '#666666',
  scrollbarThumbHoverBackColor: '#444444',
  scrollbarTrackPieceBackColor: '#292929',
  cardBackgroundColor: '#18181c',
  cardBoxShadow: '0 1px 2px -2px rgba(0, 0, 0, .24), 0 3px 6px 0 rgba(0, 0, 0, .18), 0 5px 12px 4px rgba(0, 0, 0, .12)',
  borderDivideColor: 'rgba(255, 255, 255, 0.4)',
  borderInputColor: '#e0e0e6',
};
// 暗色naive组件主题
export const darkNaiveTheme: ThemeCommonVars = {
  actionColor: 'rgba(255, 255, 255, 0.06)',
  avatarColor: 'rgba(255, 255, 255, 0.18)',
  baseColor: '#fff',
  bodyColor: 'rgb(16, 16, 20)',
  borderColor: 'rgba(255, 255, 255, 0.24)',
  borderRadius: '3px',
  borderRadiusSmall: '2px',
  boxShadow1: '0 1px 2px -2px rgba(0, 0, 0, .24), 0 3px 6px 0 rgba(0, 0, 0, .18), 0 5px 12px 4px rgba(0, 0, 0, .12)',
  boxShadow2: '0 3px 6px -4px rgba(0, 0, 0, .24), 0 6px 12px 0 rgba(0, 0, 0, .16), 0 9px 18px 8px rgba(0, 0, 0, .10)',
  boxShadow3: '0 6px 16px -9px rgba(0, 0, 0, .08), 0 9px 28px 0 rgba(0, 0, 0, .05), 0 12px 48px 16px rgba(0, 0, 0, .03)',
  buttonColor2: 'rgba(255, 255, 255, .08)',
  buttonColor2Hover: 'rgba(255, 255, 255, .12)',
  buttonColor2Pressed: 'rgba(255, 255, 255, .08)',
  cardColor: 'rgb(24, 24, 28)',
  clearColor: 'rgba(255, 255, 255, 0.38)',
  clearColorHover: 'rgba(255, 255, 255, 0.48)',
  clearColorPressed: 'rgba(255, 255, 255, 0.3)',
  closeColorHover: 'rgba(255, 255, 255, .12)',
  closeColorPressed: 'rgba(255, 255, 255, .08)',
  closeIconColor: 'rgba(255, 255, 255, 0.52)',
  closeIconColorHover: 'rgba(255, 255, 255, 0.52)',
  closeIconColorPressed: 'rgba(255, 255, 255, 0.52)',
  codeColor: 'rgba(255, 255, 255, 0.12)',
  cubicBezierEaseIn: 'cubic-bezier(.4, 0, 1, 1)',
  cubicBezierEaseInOut: 'cubic-bezier(.4, 0, .2, 1)',
  cubicBezierEaseOut: 'cubic-bezier(0, 0, .2, 1)',
  dividerColor: 'rgba(255, 255, 255, 0.4)',
  errorColor: '#e88080',
  errorColorHover: '#e98b8b',
  errorColorPressed: '#e57272',
  errorColorSuppl: 'rgb(208, 58, 82)',
  fontFamily: 'v-sans, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
  fontFamilyMono: 'v-mono, SFMono-Regular, Menlo, Consolas, Courier, monospace',
  fontSize: '14px',
  fontSizeHuge: '16px',
  fontSizeLarge: '15px',
  fontSizeMedium: '14px',
  fontSizeMini: '12px',
  fontSizeSmall: '14px',
  fontSizeTiny: '12px',
  fontWeight: '400',
  fontWeightStrong: '500',
  heightHuge: '46px',
  heightLarge: '40px',
  heightMedium: '34px',
  heightMini: '16px',
  heightSmall: '28px',
  heightTiny: '22px',
  hoverColor: 'rgba(255, 255, 255, 0.09)',
  iconColor: 'rgba(255, 255, 255, 0.38)',
  iconColorDisabled: 'rgba(255, 255, 255, 0.28)',
  iconColorHover: 'rgba(255, 255, 255, 0.475)',
  iconColorPressed: 'rgba(255, 255, 255, 0.3)',
  infoColor: '#70c0e8',
  infoColorHover: '#8acbec',
  infoColorPressed: '#66afd3',
  infoColorSuppl: 'rgb(56, 137, 197)',
  inputColor: 'rgba(255, 255, 255, 0.1)',
  inputColorDisabled: 'rgba(255, 255, 255, 0.06)',
  invertedColor: '#000',
  lineHeight: '1.6',
  modalColor: 'rgb(44, 44, 50)',
  name: 'common',
  opacity1: '0.9',
  opacity2: '0.82',
  opacity3: '0.52',
  opacity4: '0.38',
  opacity5: '0.28',
  opacityDisabled: '0.38',
  placeholderColor: 'rgba(255, 255, 255, 0.38)',
  placeholderColorDisabled: 'rgba(255, 255, 255, 0.28)',
  popoverColor: 'rgb(72, 72, 78)',
  pressedColor: 'rgba(255, 255, 255, 0.05)',
  primaryColor: '#63e2b7',
  primaryColorHover: '#7fe7c4',
  primaryColorPressed: '#5acea7',
  primaryColorSuppl: 'rgb(42, 148, 125)',
  progressRailColor: 'rgba(255, 255, 255, 0.12)',
  railColor: 'rgba(255, 255, 255, 0.2)',
  scrollbarBorderRadius: '5px',
  scrollbarColor: 'rgba(255, 255, 255, 0.2)',
  scrollbarColorHover: 'rgba(255, 255, 255, 0.3)',
  scrollbarHeight: '5px',
  scrollbarWidth: '5px',
  successColor: '#63e2b7',
  successColorHover: '#7fe7c4',
  successColorPressed: '#5acea7',
  successColorSuppl: 'rgb(42, 148, 125)',
  tabColor: 'rgba(255, 255, 255, 0.04)',
  tableColor: 'rgb(24, 24, 28)',
  tableColorHover: 'rgba(255, 255, 255, 0.06)',
  tableColorStriped: 'rgba(255, 255, 255, 0.05)',
  tableHeaderColor: 'rgba(255, 255, 255, 0.06)',
  tagColor: 'rgba(51, 51, 51, 1)',
  textColor1: 'rgba(255, 255, 255, 0.9)',
  textColor2: 'rgba(255, 255, 255, 0.82)',
  textColor3: 'rgba(255, 255, 255, 0.52)',
  textColorBase: '#000',
  textColorDisabled: 'rgba(255, 255, 255, 0.38)',
  warningColor: '#f2c97d',
  warningColorHover: '#f5d599',
  warningColorPressed: '#e6c260',
  warningColorSuppl: 'rgb(240, 138, 0)',
};

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
export const appThemeColorList: string[] = [defaultVariable.themeColor, '#009688', '#536dfe', '#ff5c93', '#ee4f12', '#0096c7', '#9c27b0', '#ff9800', '#FF3D68'];

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
export const animateList: CTypeOption<ApiAnimate>[] = [
  { value: 'zoom-fade', label: '渐变' },
  { value: 'zoom-out', label: '闪现' },
  { value: 'fade', label: '消退' },
  { value: 'fade-slide', label: '滑动' },
  { value: 'fade-top', label: '头部消退' },
  { value: 'fade-bottom', label: '底部消退' },
  { value: 'fade-scale', label: '缩放消退' },
];

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
