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
npm run typecheck --workspace=packages/shared
npm run lint --workspace=packages/website
npm run lint --workspace=packages/admin-web
npm run lint --workspace=packages/node-server
```

注意：`node-server` **没有 typecheck 脚本**，验证类型正确用 `npm run build --workspace=packages/node-server`（`nest build` 含类型检查）。`admin-web` 的 `lint` 已含 `vue-tsc --noEmit`，其 `build` 是 `vue-tsc --noEmit && vite build`。

admin-mobile 不是 workspace，`--workspace=packages/admin-mobile` 会报 `No workspaces found`。必须进其目录运行：

```bash
cd packages/admin-mobile && npm run lint   # eslint + vue-tsc
```

## 构建输出目录

- admin-web → `manage/`
- website → `home/`
- node-server → `dist/`
- admin-mobile → `unpackage/`
- shared → `types/`（`emitDeclarationOnly`，`tsc --build` 输出 .d.ts 到 `packages/shared/types/`；不是 `dist/`）

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

> 改 shared 后（尤其 `src/constants/` 或新增 `types/` 文件），必须先 `npm run build --workspace=packages/shared` 重新生成 `.d.ts` 到 `types/`，否则管理端/移动端的 `vue-tsc`/`vue-tsc` 会报 `has no exported member`。`typecheck`（`--noEmit`）不生成声明，不能替代 build。
>
> 若要新建 shared 常量/类型，注意它同时被 `admin-web`（经 `@/constant` 重导出 `@shared/constants/*`）与移动端（相对路径 `../../../shared/src/...`）消费，两处都要能解析。

## 财务/账单模块 (node-server `blogs/money`)

聚合入口在 `modules/blog/money/money.service.ts`：`findAggregatePage`（用 `$unionWith` 聚合多来源）、`findAggregateOne`（详情）、`updateAggregate`、余额统计 `statisticsMoneyBalance`、银行流水 `statisticsBankFlow`、收支统计 `statisticsInflowOrOutflowMoney`。

关键架构事实，改这些最易踩坑：

- 账单来源：`bank`（银行，本人卡号在 `voucherNo`/`voucherType`）、`aliPay`、`weChat`、`manual`（人工录入）。聚合类型 `BillSourceType` 与 DTO 的 `@IsIn([...])` 都要同步加新来源。
- 模型/映射在 `money.service.ts` `modelMap`/`mapperMap`；`$unionWith` 用 `modelMap[src].collection.name`，新表须配合 `blog.module.ts` 的 `RouterModule.register` 挂到 `/money` 子路由。**楼层名 `money.service` 依赖的 Service 都要从模块 `imports` 传入。**
- 新增 controller 若用 `@UseGuards(JwtAuthGuard)`，其模块必须 `imports: [..., UserModule, forwardRef(() => RoleModule)]`（`JwtAuthGuard` 注入 `UserService`+`RoleService`），漏了会报 `Nest can't resolve dependencies of the JwtAuthGuard (UserService, ?)`。
- `money.module.ts` 的 `AGGREGATE_MONGO_MODULE` forFeature 也要把新 schema 加进去。
- 金额比较用 `sumArrayToMoney`/`nowDateFun`，日期查询范围用 `format(..., "yyyy-MM-dd 00:00:00/23:59:59")`。
- 银行卡片报废表 `bank-card`：`statisticsMoneyBalance` 会过滤 `status===2` 的报废卡；`findAggregateOne` 对报废卡返回 `isRetiredBankCard/bankCardRemark/replaceCardNo`。

### 银行凭证 (voucher)
银行账单里本人卡号 = `voucherNo`，卡类型 = `voucherType`（1 存折 / 2 储蓄卡 / 3 信用卡）；`tradeOtherPersonAccount` 是**对方**账号，别混淆。