# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 构建和开发命令

```bash
# 开发模式（使用 .env.dev）
yarn dev

# 使用生产配置本地开发（使用 .env.prod-local）
yarn dev:prod

# 生产环境构建（使用 .env.prod）
yarn build

# 预览生产构建
yarn preview

# 检查 TypeScript/JavaScript 文件
yarn lint

# 检查并修复样式文件
yarn lint:stylelint
```

## 架构概述

### 入口点和应用包装层
`src/main.tsx` 启动应用，包含三层包装：
1. `SharpProvider` - Ant Design ConfigProvider，配置中文语言包
2. Redux `Provider` - 状态管理
3. `BrowserRouter` - 路由管理

### 路由配置
使用 React Router v6 的 `useRoutes` 模式，路由定义在 `src/router/index.tsx`：
- 主布局 `BaseLayout` 包裹：首页 (`/`)、分类页 (`/classify`)、文章详情 (`/articleDetails/:articleId`)
- 独立页面：`/middle`
- 错误页面：`/403`、`/404`、`/500`，由 `ErrorLayout` 包裹
- 未匹配路由重定向到 `/404`

### 状态管理
使用 Redux Toolkit，单一 slice 在 `src/store/modules/common.ts`，store 配置在 `src/store/index.ts`。

### API 层
自定义 Axios 封装在 `src/api/axios/customAxios.ts`，创建两个独立的 API 客户端：
- `AxiosCapital` - 用于 capital 相关接口（配置 `VITE_CAPITAL_API_URL`）
- `AxiosBlog` - 用于博客接口（配置 `VITE_BLOG_API_URL`）

两个实例都处理请求/响应转换、错误消息提示和状态检查。API 函数从 `src/api/index.ts` 导出，按领域组织（如 `src/api/blog/article.ts`）。

### 环境配置
通过 `.env`、`.env.dev`、`.env.prod`、`.env.prod-local` 加载环境变量。主要变量：
- `VITE_PORT` - 开发服务器端口
- `VITE_PROXY` - 本地开发代理配置
- `VITE_CAPITAL_API_URL` / `VITE_BLOG_API_URL` - API 基础地址
- `VITE_IMG_URL` - 图片 URL 前缀

### 路径别名
- `@/` → `src/`
- `/#/` → `types/`

### 样式
使用 SCSS，共享变量在 `src/styles/variable.scss`（使用 CSS 自定义属性实现主题灵活性）。入口文件是 `src/styles/index.scss`。

### TypeScript 类型定义
全局类型定义在 `types/` 目录：
- `global.d.ts` - `ViteEnv`、`Recordable` 等类型
- `axios.d.ts` - Axios 请求/响应选项和 `Result` 接口

### Canvas 插件
背景特效在 `src/plugins/canvas/`：
- `particle-back.ts` - 粒子背景动画
- `heart.ts` - 心形动画
- `fallen-leaves.ts` - 落叶效果

## 开发规范
- 使用 TypeScript strict 模式
- 优先使用 interface 而非 type
- 禁止使用 any，使用 unknown 替代
- 根据css代码规则写代码
