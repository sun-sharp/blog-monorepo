# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### Added

- Monorepo 项目结构重构
- 共享类型目录 `packages/shared/types/`
- 统一的路径别名配置

### Changed

- 整合类型定义到共享目录结构
- 统一 admin-web 类型导入路径到 `/#/common/*`
- 统一 website 类型导入路径到 `/#/common/*` 和 `/#/react/*`
- 移除 website lint 命令中不存在的 `types` 目录参数

## [2.6.2] - node-server

### Features

- 博客管理系统：文章、分类、图片管理
- 财务管理：微信、支付宝、银行账单导入和分析
- 用户权限管理：JWT认证、角色权限、菜单管理
- 待办事项和日程管理
- 文件上传和图片管理
- 定时任务：数据备份、任务清理等

### Technical

- NestJS 10.2.7
- MongoDB + Mongoose 7.6.4
- JWT + Passport 认证
- Excel 处理: exceljs 4.4.0
- PDF 生成: puppeteer 22.3.0
- API 文档: Swagger + Compodoc

## [2.5.3] - admin-web

### Features

- 基于 Vue 3 + Naive UI 的管理后台
- 文章管理、分类管理
- 用户管理、角色管理、菜单管理
- 财务管理：支付宝、微信、银行账单
- 图片文件管理
- 仪表盘数据可视化

### Technical

- Vue 3.5.33 + Composition API
- Vite 8.0.10
- TypeScript 6.0.3
- Naive UI 2.44.1
- Pinia 状态管理
- ECharts 图表

## [2.3.3] - website

### Features

- 基于 React 18 + Ant Design 的博客前台
- 文章列表展示、文章详情
- 分类浏览
- 响应式设计
- 用户登录状态显示

### Technical

- React 18.3.1
- Vite 6.3.5
- TypeScript 6.0.3
- Ant Design 5.24.8
- Redux Toolkit 状态管理
- React Router 7.5.0

---

## 历史版本

详细的子项目版本历史请查看各项目的 CHANGELOG.md：

- [admin-web/CHANGELOG.md](./packages/admin-web/CHANGELOG.md)
- [website/CHANGELOG.md](./packages/website/CHANGELOG.md)
