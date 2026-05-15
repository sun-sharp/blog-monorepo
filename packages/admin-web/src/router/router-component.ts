// 根目录
export const Layout = () => import('@/layout/LayoutIndex.vue');

// 路由渲染
export const LayoutRouterView = () => import('@/layout/LayoutRouterView.vue');

// 首页
export const HomeComponent = () => import('@/views/home/index.vue');

// iframe嵌入
export const IframeComponent = () => import('@/views/iframe.vue');

// 404页面
export const Error404Component = () => import('@/views/error-404.vue');

// 重定向页面
export const RedirectComponent = () => import('@/views/redirect.vue');

// 登录页面
export const LoginComponent = () => import('@/views/common/login.vue');

// 基本信息设置页面
export const SettingAccountComponent = () => import('@/views/common/setting-account.vue');

// 密码更新页面
export const SettingPasswordComponent = () => import('@/views/common/setting-password.vue');
