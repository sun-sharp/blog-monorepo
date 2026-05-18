# Blog Monorepo

一个基于 Monorepo 架构的个人博客系统，包含前端网站、管理后台和后端 API 服务。

## 项目结构

```
blog-monorepo/
├── packages/
│   ├── admin-web/      # Vue 3 管理后台 (Naive UI)
│   ├── website/        # React 18 博客网站 (Ant Design)
│   ├── node-server/    # NestJS 后端 API (MongoDB)
│   └── shared/         # 共享类型定义
├── package.json        # 根配置
└── AGENTS.md           # 开发指南
```

## 子项目

| 项目 | 技术栈 | 版本 | 说明 |
|------|--------|------|------|
| admin-web | Vue 3 + Naive UI + Vite | 2.5.3 | 博客管理后台 |
| website | React 18 + Ant Design + Vite | 2.3.3 | 博客前台网站 |
| node-server | NestJS + MongoDB + Mongoose | 2.6.2 | 后端 API 服务 |

## 快速开始

### 安装依赖

```bash
npm install
```

### 开发命令

```bash
# 启动开发服务器
npm run dev:website    # website 开发服务器 (端口 9222)
npm run dev:admin      # admin-web 开发服务器 (端口 8222)
npm run dev:server     # node-server 开发模式 (端口 3000)

# 或进入各自目录运行
cd packages/website && npm run dev
cd packages/admin-web && npm run dev
cd packages/node-server && npm run start:dev
```

### 构建命令

```bash
npm run build:website   # 构建 website
npm run build:admin     # 构建 admin-web
npm run build:server    # 构建 node-server
npm run build:all       # 构建所有项目
```

### Lint 命令

```bash
npm run lint:website    # website lint 检查
npm run lint:admin      # admin-web lint 检查
npm run lint:server     # node-server lint 检查
npm run typecheck:all   # 所有项目类型检查
```

## 构建输出目录

| 项目 | 输出目录 |
|------|----------|
| admin-web | `manage/` |
| website | `home/` |
| node-server | `dist/` |

## 路径别名

所有项目统一使用以下路径别名：

| 别名 | 映射路径 |
|------|----------|
| `@/*` | `src/*` |
| `/#/api/*` | `packages/shared/types/api/*` |
| `/#/models/*` | `packages/shared/types/models/*` |
| `/#/common/*` | `packages/shared/types/common/*` |

各项目特有类型目录：

| 项目 | 别名 | 映射路径 |
|------|------|----------|
| admin-web | `/#/vue/*` | `packages/shared/types/vue/*` |
| website | `/#/react/*` | `packages/shared/types/react/*` |
| node-server | `/#/*` (默认) | `packages/shared/types/models/*` |

## 环境变量

各项目使用不同的环境配置文件：

| 项目 | 配置文件 |
|------|----------|
| admin-web | `.env.dev`, `.env.dev-local`, `.env.prod`, `.env.prod-local` |
| website | `.env`, `.env.dev`, `.env.prod`, `.env.prod-local` |
| node-server | `store/json/database/dev.json`, `store/json/database/prod.json` |

## API 代理配置

开发环境代理：

| 前缀 | 目标模块 |
|------|----------|
| `/capital-api` | 后端 capital 模块 |
| `/blog-api` | 后端 blog 模块 |

website 默认代理到 `http://127.0.0.1:3000`

## 关键注意事项

### TypeScript 6.x 配置

前端项目 `tsconfig.json` 必须包含：

```json
"ignoreDeprecations": "6.0"
```

### SCSS 规范 (website)

必须使用 `@use`/`@forward`，禁止 `@import`（Sass 3.0 已弃用）。需要变量的文件必须显式导入：

```scss
@use '../../styles/variable' as *;
```

### SCSS 全局注入 (admin-web)

vite.config.ts 已配置自动注入，无需手动导入：

```scss
@use "@/styles/variable.scss" as *;
```

## 共享代码

`packages/shared/` 目录用于存放跨项目共享代码：

- `types/api/` - API 相关类型定义
- `types/models/` - 数据库模型类型定义
- `types/common/` - 公共基础类型
- `types/vue/` - Vue 项目专用类型
- `types/react/` - React 项目专用类型

## License

MIT
