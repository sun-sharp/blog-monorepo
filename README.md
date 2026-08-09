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
# 进入各自目录运行
cd packages/website && npm run dev
cd packages/admin-web && npm run dev
cd packages/node-server && npm run start:dev

# admin-mobile运行需在HBuilder X 里
```

### 构建命令

```bash
# 进入各自目录构建
cd packages/website && npm run build # 构建 website
cd packages/admin-web && npm run build # 构建 admin-web
cd packages/node-server && npm run build:server    # 构建 node-server

# admin-mobile构建需在HBuilder X 里
```

## 共享代码

`packages/shared/` 目录用于存放跨项目共享代码：

### 类型定义 (`types/`)

- `types/api/` - API 相关类型定义
  - `api/capital/` - 管理后台相关类型（menu、user、role、category 等）
  - `api/blog/` - 博客相关类型（article、schedule、money 等）
  - `api/common/` - 公共 API 类型
  - `api/config.d.ts` - 配置类型
- `types/common/` - 公共基础类型
- `types/vue/` - Vue 项目专用类型
- `types/react/` - React 项目专用类型

### 共享源码 (`src/`)

- `src/utils/` - 共享工具函数（is、storage、axios、files 等）
- `src/constants/` - 共享常量（storage-name、http-enum 等）

## git 创建版本标签和从dev拉取到main的命令
```bash
# 切换到本地 main（如果尚未切换）
git checkout main
# 或 git switch main
```


## License

MIT
