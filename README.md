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
# 重新安装依赖 该命令会先删除 node_modules、yarn.lock、package.lock.json 后再进行依赖重新安装（安装速度会明显变慢）
yarn reinstall
```

## 更新日志

[CHANGELOG](./CHANGELOG.md)

## 浏览器支持

本地开发推荐使用`Chrome 80+` 浏览器

支持现代浏览器, 不支持 IE


## 安装插件说明

### dependencies
- axios ajax插件
- mockjs 虚拟接口
- pinia 是一个用于 Vue 的状态管理库，类似 Vuex, 是 Vue 的另一种状态管理方案
- date-fns 是一个非常好用的JS时间处理库,同时支持浏览器和NodeJS环境,而且使用方便,API全面,
- vue vue3版本
- vue-router vue路由

### devDependencies
- @types/node                         nodejs的ts文件
- @typescript-eslint/eslint-plugin    ts的eslint插件配置所需
- @typescript-eslint/parser           ts的eslint插件配置所需
- @vitejs/plugin-vue                  提供 Vue 3 单文件组件支持
- @vitejs/plugin-vue-jsx              提供 Vue 3 JSX 支持
- eslint                              代码检查
- eslint-config-prettier              在eslint中加入prettier
- eslint-plugin-prettier              在eslint中加入prettier
- eslint-plugin-vue                   vue的eslint
- prettier                            prettier版代码检查
- typescript                          ts语法
- vite                                新型前端构建工具
- vite-plugin-compression             gzip压缩
- vite-plugin-html                    一个为index.html提供minify和基于EJS模板功能的Vite插件。
- vite-plugin-mock                    使用mock模拟数据请求
- vue-tsc                             在vue中使用tsc
- stylelint                           css, less, scss 代码验证
- stylelint-config-prettier 
- stylelint-config-standard 
- stylelint-order 
- stylelint-scss
