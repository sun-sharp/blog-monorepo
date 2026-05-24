# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 构建和开发命令

```bash
# 开发模式（使用 .env.dev）
npm run dev

# 使用生产配置本地开发（使用 .env.prod-local）
npm run dev:prod

# 生产环境构建（使用 .env.prod）
npm run build

# 预览生产构建
npm run preview

# 检查 TypeScript/JavaScript 文件
npm run lint

# 检查并修复样式文件
npm run lint:stylelint
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
使用 SCSS，完全采用 Sass 3.0.0 兼容的 `@use`/`@forward` 模块化架构。

**样式文件结构：**
- `src/styles/index.scss` - 主入口，使用 `@use` 导入所有样式模块
- `src/styles/variable.scss` - 全局变量定义（变量命名格式为 `$xxx`，不含前导 `-`）
- `src/styles/_common.scss` - mixin 定义和静态工具类
- `src/styles/_common-exec.scss` - 执行 mixin 生成动态工具类样式
- `src/styles/_normalize.scss` - 样式重置
- `src/styles/_animate.scss` - 动画关键帧定义
- `src/styles/_layout.scss` - 布局样式
- `src/styles/mixins/index.scss` - 响应式媒体查询（使用 `@forward`）

**重要规范：**
- 所有 SCSS 文件必须使用 `@use` 或 `@forward`，禁止使用 `@import`（已被 Sass 3.0.0 弃用）
- 需要使用变量的文件必须在文件开头显式 `@use` 导入：`@use '../../styles/variable' as *;`
- Vite 配置中设置 `quietDeps: true` 抑制依赖警告
- `_common-exec.scss` 专门用于执行 mixin，避免在模块定义时直接生成样式

### TypeScript 类型定义
全局类型定义在 `types/` 目录：
- `global.d.ts` - `ViteEnv`、`Recordable` 等类型
- `axios.d.ts` - Axios 请求/响应选项和 `Result` 接口

### Canvas 插件
背景特效在 `src/plugins/canvas/`：
- `particle-back.ts` - 粒子背景动画
- `heart.ts` - 心形动画
- `fallen-leaves.ts` - 落叶效果

### 用户认证和头像功能
头部头像组件 (`src/layouts/header/LayoutHeader.tsx`) 提供以下功能：
- **登录状态检测**：通过检查 `ACCESS_TOKEN` 存储值判断用户是否登录
- **动态头像显示**：
  - 从 `CURRENT_USER` 存储获取用户数据（包含 `avatar` 和 `nickname` 字段）
  - 使用 `getImgUrl` 函数（`src/utils/files.ts`）处理头像URL，确保完整路径
  - 头像加载失败时自动回退到默认头像 `default-avatar.png`
- **下拉菜单**：
  - "个人介绍"：触发 `AuthorIntroSlide` 组件从左侧滑出
  - "退出登录"：删除 `ACCESS_TOKEN`、`CURRENT_USER`、`USER_CONFIG` 存储值并刷新页面
- **登录按钮**：用户未登录时显示登录按钮，点击跳转到 `https://www.yangruirui.top/manage`

个人介绍组件 (`src/components/common/AuthorIntro/`) 优化：
- 根据 `CURRENT_USER` 数据动态显示用户昵称
- 使用用户自定义头像，支持头像加载失败处理

存储相关常量定义在 `src/constants/storage-name.ts`：
- `ACCESS_TOKEN` - 用户认证令牌
- `CURRENT_USER` - 当前用户信息（包含 avatar、nickname 等字段）
- `USER_CONFIG` - 用户配置信息

## 开发规范
- 使用 TypeScript strict 模式
- 优先使用 interface 而非 type
- 禁止使用 any，使用 unknown 替代
- TypeScript 6.x 需要配置 `"ignoreDeprecations": "6.0"`（字符串值）在 `tsconfig.json` 和 `tsconfig.node.json`
- 添加 `"types": ["node"]` 到 `tsconfig.json` 的 `compilerOptions` 以解决 `NodeJS` 命名空间问题
- 安装 `@types/node@latest` 作为开发依赖：`npm install @types/node@latest --save-dev`
- **SCSS 规范**：必须使用 `@use`/`@forward` 替代 `@import`，确保与 Sass 3.0.0 兼容。所有样式模块需显式导入变量文件 `@use 'relative/path/to/variable' as *;`
