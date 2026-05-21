# AGENTS.md — admin-mobile

uni-app (Vue 3) 移动端管理后台，目标平台为全平台。

## 开发命令

> 直接在HBuilder X 里运行和发布，不需要命令行，

## Lint

代码验证
```bash
npm run lint --workspace=packages/admin-mobile
```

项目独立 typecheck 脚本
```bash
npm run typecheck
```

## 项目结构要点

- **没有 `src/` 目录**——uni-app 约定：页面放根级 `pages/`，组件放根级 `components/`，静态资源放 `static/`
- **没有 `vite.config.ts`**——构建由 HBuilderX 管理，不要自行添加
- `pages.json` 是路由配置（等价于 Vue Router），新增页面必须在此注册
- `manifest.json` 是应用配置（appid、平台设置等）
- 入口是 `main.ts`，使用 `createSSRApp`（不是 `createApp`）
- 构建输出目录：`unpackage/`

## 路径别名

| 别名 | 解析为 | 用途 |
|------|--------|------|
| `/#/*` | `packages/shared/types/*` | 解析到 `shared/types/`，对类型就只有这个 |

## uni-app 特有约定

- 使用 `<view>` `<text>` `<image>` 替代 `<div>` `<span>` `<img>`
- 尺寸单位用 `rpx` 而非 `px`（750rpx = 屏幕宽度）
- `uni.scss` 中的变量在所有 vue 文件的 `<style lang="scss">` 中自动可用，无需手动导入
- 页面生命周期用 `onLoad` / `onShow` / `onReady`，不是 Vue 的 `mounted`

## TypeScript

- tsconfig 必须包含 `"ignoreDeprecations": "6.0"`
- 类型来源：`@dcloudio/types`（uni-app API 类型）+ `packages/shared/types/`（项目扩展类型）
- `env.d.ts` 声明了 `.vue` 模块，不要删除

## 环境变量

须符合 HBuilder X 配置规则
- `.env` — 公共基础
- `.env.development` — HBuilderX 运行时自动加载，避免和 `.env` 重复
- `.env.production` — HBuilderX 发行时自动加载，避免和 `.env` 重复
