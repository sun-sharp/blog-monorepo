// 整体配置
export const projectSetting = {
  //导航模式 vertical 左侧菜单模式 horizontal 顶部菜单模式
  navMode: 'vertical',
  //导航风格 dark 暗色侧边栏 light 白色侧边栏 header-dark 暗色顶栏
  navTheme: 'dark',
  //顶部
  headerSetting: {
    //背景色
    bgColor: '#fff',
    //固定顶部
    fixed: true,
    //显示重载按钮
    isReload: true,
  },
  //页脚
  showFooter: true,
  //多标签
  multiTabsSetting: {
    //背景色
    bgColor: '#fff',
    //是否显示
    show: true,
    //固定多标签
    fixed: true,
  },
  //菜单
  menuSetting: {
    //最小宽度
    minMenuWidth: 64,
    //菜单宽度
    menuWidth: 200,
    //固定菜单
    fixed: true,
    //分割菜单
    mixMenu: false,
    //默认展开
    collapsed: false,
  },
  //面包屑
  crumbsSetting: {
    //是否显示
    show: true,
    //显示图标
    showIcon: false,
  },
  //是否开启路由动画
  isPageAnimate: true,
  //路由动画类型
  pageAnimateType: 'zoom-fade',
};

// 全局颜色数组
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

// 主题设置
export const designSetting = {
  //深色主题
  darkTheme: false,
  //系统主题色
  appTheme: '#2d8cf0',
  //系统内置主题色列表
  appThemeList,
};

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
