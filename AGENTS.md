# AGENTS.md

## 项目结构

Monorepo 包含 3 个独立项目：
- `packages/admin-web` - Vue 3 管理后台 (Naive UI)
- `packages/website` - React 18 博客网站 (Ant Design)
- `packages/node-server` - NestJS 后端 API (MongoDB)

## 开发命令

```bash
# 根目录快捷命令
npm run dev:website    # website 开发服务器 (端口 9222)
npm run dev:admin      # admin-web 开发服务器 (端口 8222，使用 dev-local 模式)
npm run dev:server     # node-server 开发模式 (端口 3000)

# 或进入各自目录运行
cd packages/website && npm run dev
cd packages/admin-web && npm run dev        # 默认 dev-local 模式
cd packages/admin-web && npm run dev:text   # dev 模式
cd packages/node-server && npm run start:dev
```

## 构建输出目录

- admin-web → `manage/`
- website → `home/`
- node-server → `dist/`

## 路径别名（所有项目统一）

- `@/*` → `src/*`
- `/#/*` → `packages/shared/types/{project-name}/*`

各项目自动映射到对应的 types 目录：
- admin-web → `packages/shared/types/admin-web/`
- website → `packages/shared/types/website/`
- node-server → `packages/shared/types/node-server/`

## 关键注意事项

### TypeScript 6.x 配置
前端项目 tsconfig.json 必须包含：
```json
"ignoreDeprecations": "6.0"
```

### SCSS 规范 (website)
必须使用 `@use`/`@forward`，禁止 `@import`（Sass 3.0 已弃用）。
需要变量的文件必须显式导入：
```scss
@use '../../styles/variable' as *;
```

### SCSS 全局注入 (admin-web)
vite.config.ts 已配置自动注入，无需手动导入：
```scss
@use "@/styles/variable.scss" as *;
```

### 环境变量
- `.env.dev` - 开发环境
- `.env.dev-local` - 本地开发
- `.env.prod` - 生产环境
- `.env.prod-local` - 本地生产测试

### API 代理配置
开发环境代理：
- `/capital-api` → 后端 capital 模块
- `/blog-api` → 后端 blog 模块

website 默认代理到 `http://127.0.0.1:3000`

### node-server 数据库配置
需要在 `store/json/database/` 创建：
- `dev.json` - 开发环境数据库配置
- `prod.json` - 生产环境数据库配置

## Lint 命令

```bash
# 各项目独立 lint
npm run lint --workspace=packages/website
npm run lint --workspace=packages/admin-web
npm run lint --workspace=packages/node-server
```

## 共享代码

`packages/shared/` 目录用于存放跨项目共享代码。
