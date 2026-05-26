# website

## 介绍

是基于[React](https://github.com/facebook/react) + [TypeScript](https://www.typescriptlang.org/) + [Vite](https://github.com/vitejs/vite) 的模板

## 安装使用

- node 版本 24.14.0


- 安装依赖

```bash
cd website
npm install
```

### scripts

```bash
# 运行本地接口项目
npm run dev
# 运行线上接口项目
npm run dev:prod
# 运行并监听本地接口
npm run dev:debug
# 构建项目
npm run build
# 直接预览本地打包文件目录
npm run preview
# 执行 eslint 校验，并修复部分问题
npm run lint
# 执行 stylelint 格式化
npm run lint:stylelint
# 重新安装依赖 该命令会先删除 node_modules、npm run.lock、package-lock.json，后再进行依赖重新安装（安装速度会明显变慢）
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

# 是一个非常好用的JS时间处理库
date-fns

```

### devDependencies

```bash

# 代码检查 并在eslint中加入prettier配置
eslint

```
