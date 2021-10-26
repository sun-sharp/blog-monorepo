# vue3-ts-manage

## 介绍

是基于[Vue3.0](https://github.com/vuejs/vue-next) + [TypeScript](https://www.typescriptlang.org/) + [Vite](https://github.com/vitejs/vite) 的模板

## 安装使用

- 获取项目代码

```bash
git clone https://github.com/sun-sharp/vue3-ts-manage.git
```

- 安装依赖

```bash
cd vue3-ts-manage
yarn install
```

### scripts

```bash
# 运行项目
yarn serve
# 构建项目
yarn build
# 执行 eslint 校验，并修复部分问题
yarn lint
# 直接预览本地打包文件目录
yarn preview
# 执行 stylelint 格式化
yarn lint:stylelint
# 重新安装依赖 该命令会先删除 node_modules、yarn.lock、package.lock.json，后再进行依赖重新安装（安装速度会明显变慢）
yarn reinstall
```

## 更新日志

[CHANGELOG](./CHANGELOG.md)

## 浏览器支持

本地开发推荐使用`Chrome 80+` 浏览器

支持现代浏览器, 不支持 IE

## 安装插件说明

### dependencies

```bash
# ajax插件
axios

# 虚拟接口
mockjs

# 是一个用于 Vue 的状态管理库，类似 Vuex, 是 Vue 的另一种状态管理方案
pinia

# vue3版本
vue

# vue路由
vue-router

# 从ant设计图标集成的Vue3 SVG图标组件
@vicons/antd
```

### devDependencies

```bash
#  ts语法
typescript
@types/node # nodejs的ts文件
@typescript-eslint/eslint-plugin # ts的eslint插件配置所需
@typescript-eslint/parser # ts的eslint插件配置所需
vue-tsc # 在vue中使用tsc

# 代码检查 并在eslint中加入prettier配置
eslint
eslint-config-prettier
eslint-plugin-prettier
eslint-plugin-vue
prettier
vue-eslint-parser # vue的eslint配置

# sass
sass
sass-loader
node-sass

# css, less, scss 代码验证
stylelint
stylelint-config-prettier
stylelint-config-standard
stylelint-order
stylelint-scss

# vite 新型前端构建工具
vite
vite-plugin-compression # gzip压缩
vite-plugin-html # 一个为index.html提供minify和基于EJS模板功能的Vite插件。
vite-plugin-mock # 使用mock模拟数据请求
@vitejs/plugin-vue # 提供 Vue 3 单文件组件支持
@vitejs/plugin-vue-jsx # 提供 Vue 3 JSX 支持
```
