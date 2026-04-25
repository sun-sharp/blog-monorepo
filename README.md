# blog-manage-web

## 介绍

是基于[Vue3.0](https://github.com/vuejs/vue-next) + [TypeScript](https://www.typescriptlang.org/) + [Vite](https://github.com/vitejs/vite) 的模板

## 安装使用

- 获取项目代码

```bash
git clone https://github.com/sun-sharp/blog-manage-web.git
```

- 安装依赖

```bash
cd blog-manage-web
npm install
```

### scripts

```bash
# 运行项目
npm run serve
# 构建项目
npm run build
# 执行 eslint 校验，并修复部分问题
npm run lint
# 直接预览本地打包文件目录
npm run preview
# 执行 stylelint 格式化
npm run lint:stylelint
# 重新安装依赖 该命令会先删除 node_modules、yarn.lock、package.lock.json，后再进行依赖重新安装（安装速度会明显变慢）
npm run reinstall
```

## 更新日志

[CHANGELOG](./CHANGELOG.md)

## 浏览器支持

本地开发推荐使用`Chrome 80+` 浏览器

支持现代浏览器, 不支持 IE

## 安装插件说明

### dependencies

```bash
# 从ant设计图标集成的Vue3 SVG图标组件
@vicons/antd

# ionicons5的图标
@vicons/ionicons5

# ajax插件
axios

# 是一个非常好用的JS时间处理库
date-fns

# echarts图表
echarts

# 切换左侧菜单展示效果，监听dom元素宽度变化
element-resize-detector

# 滑块验证码
makeit-captcha

# 虚拟接口
mockjs

# naive组件
naive-ui

# 是一个用于 Vue 的状态管理库，类似 Vuex, 是 Vue 的另一种状态管理方案
pinia

# 传参问题
qs

# vue3版本
vue

# vue路由
vue-router

# 是一款基于Sortable.js实现的vue拖拽插件
vuedraggable
```

### devDependencies

```bash
# ts语法
@types/node # nodejs的ts文件
@typescript-eslint/eslint-plugin # ts的eslint插件配置所需
@typescript-eslint/parser # ts的eslint插件配置所需

# vite 新型前端构建工具
@vitejs/plugin-vue # 提供 Vue 3 单文件组件支持
@vitejs/plugin-vue-jsx # 提供 Vue 3 JSX 支持

# 它是为Vue 2和3服务的一套Vue Composition API的常用工具集
@vueuse/core

# postcss的插件 添加了 vendor 浏览器前缀，它使用 Can I Use 上面的数据。
autoprefixer 

# 代码检查 并在eslint中加入prettier配置
eslint
eslint-config-prettier
eslint-plugin-prettier
eslint-plugin-vue

#  是一个允许使用 JS 插件转换样式的工具
postcss

# 代码检查
prettier

# sass
sass
sass-loader

# css, less, scss 代码验证
stylelint
stylelint-config-prettier
stylelint-config-standard
stylelint-order
stylelint-scss

# ts语法
typescript

# vite 新型前端构建工具
vite
vite-plugin-html # 一个为index.html提供minify和基于EJS模板功能的Vite插件。
vite-plugin-mock # 使用mock模拟数据请求

# vue的eslint配置
vue-eslint-parser

# 在vue中使用tsc
vue-tsc
```
