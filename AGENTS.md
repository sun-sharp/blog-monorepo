# AGENTS.md

## 项目结构

单仓库包含多个独立项目：

- `packages/website` - React 18 博客网站 (Ant Design)
- `packages/admin-web` - Vue 3 管理后台 (Naive UI)
- `packages/node-server` - NestJS 后端 API (MongoDB)
- `packages/shared` - 跨项目共享代码（类型 + 工具源码）

**npm workspaces**（根 `package.json` `workspaces`）只包含以上 4 个：`website`、`admin-web`、`node-server`、`shared`。

另有两个 **不在 npm workspaces 中** 的目录（uni-app，用 HBuilderX 运行，根目录无法用 `--workspace=` 操作）：

- `packages/admin-mobile` - uni-app 移动端 (uView Pro)，有自身 `package.json` 与 `AGENTS.md`
- `packages/admin-mobile-x` - uni-app x 变体（`App.uvue`/`main.uts`），**无 `package.json`**，不是 npm 包

注意根目录存在 `pnpm-workspace.yaml`，但实际用 npm，不要用 pnpm 命令。

详细的项目内约定见各自的 `AGENTS.md`/`CLAUDE.md`（`admin-mobile`、`node-server`、`admin-web` 均有）。

## 开发命令

根 `package.json` 脚本极少（`start:watch:server`、`typecheck:shared`、`git:dev-main-dev`）——**没有 `dev:*` 快捷命令**。到各项目目录运行：

```bash
# website (端口 9222)
cd packages/website && npm run dev

# admin-web (端口 8222)
cd packages/admin-web && npm run dev        # vite --mode dev-local
cd packages/admin-web && npm run dev:text   # vite --mode dev
cd packages/admin-web && npm run dev:prod

# node-server (端口 3000) —— 注意没有 start:dev，用下面的
cd packages/node-server && npm run start            # 不热重载
cd packages/node-server && npm run start:watch_debug  # 热重载 + debug
npm run start:watch:server  # 根目录等价于上一条

# shared（被各项目经别名引用，通常无需手动启动；改类型后建议 typecheck）
cd packages/shared && npm run typecheck

# admin-mobile：无 dev 脚本，用 HBuilderX 运行（见其 AGENTS.md）
```

## Lint / typecheck

只有 npm workspaces 内项目能从根用 `--workspace=`：

```bash
npm run lint --workspace=packages/website
npm run lint --workspace=packages/admin-web
npm run lint --workspace=packages/node-server
npm run typecheck --workspace=packages/shared
```

admin-mobile 不是 workspace，`--workspace=packages/admin-mobile` 会报 `No workspaces found`。必须进其目录运行：

```bash
cd packages/admin-mobile && npm run lint   # eslint + vue-tsc
```

## 构建输出目录

- admin-web → `manage/`
- website → `home/`
- node-server → `dist/`
- admin-mobile → `unpackage/`
- shared → `dist/`

## 路径别名（所有项目统一）

- `@/*` → `src/*`
- `/#/api/*` → `packages/shared/types/api/*` (共享 API 类型)
- `/#/common/*` → `packages/shared/types/common/*` (共享基础类型)
- `@shared/*` → `packages/shared/src/*` (共享源码)

各项目特有类型，`/#/*` 默认映射：
- admin-web → `packages/shared/types/vue/`
- admin-mobile → `packages/shared/types/uni/`
- website → `packages/shared/types/react/`
- node-server → `packages/shared/types/`

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
vite.config.ts 已配置 `additionalData` 自动注入，无需手动导入。

### 环境变量
各类环境文件按所在项目加载，参考各项目 `.env*`：
- website 代理目标由 `VITE_PROXY` 环境变量驱动（`.env.dev` → `http://127.0.0.1:3000`，`.env.prod-local` → 线上域名），**不是硬编码 3000**
- node-server 代理：`/capital-api` → capital 模块，`/blog-api` → blog 模块

### node-server 数据库配置
需要在 `store/json/database/` 创建：
- `dev.json` - 开发环境数据库配置
- `prod.json` - 生产环境数据库配置

## 共享代码 (packages/shared)

- `types/` - 跨项目类型：`api/`(capital, blog, common)、`common/`、`vue/`、`react/`、`uni/`
- `src/utils/` - 共享工具 (is, storage, axios, files, array, string, time, color)
- `src/constants/` - 共享常量 (storage-name, http-enum, api-type, page-const, table-const)

> 改 shared 类型后，各项目编译时经别名引用会自动生效；共享源码改动需确认消费方兼容。