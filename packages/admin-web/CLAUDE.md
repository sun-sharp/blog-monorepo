# admin-web - 博客管理后台

这是一个基于 Vue 3 + TypeScript + Vite 的博客管理后台系统，使用 Naive UI 作为组件库。

## 技术栈

- **框架**: Vue 3.3.4 + Composition API
- **构建工具**: Vite 4.4.7
- **语言**: TypeScript 5.1.6
- **UI 组件库**: Naive UI 2.35.0
- **状态管理**: Pinia 2.1.6
- **路由**: Vue Router 4.2.4
- **HTTP 客户端**: Axios 1.4.0
- **图表库**: ECharts 5.4.3, @antv/g2plot 2.4.31
- **代码编辑器**: md-editor-v3 4.8.1, CodeMirror
- **工具库**: date-fns 2.30.0, @vueuse/core 10.3.0, qs 6.11.2
- **拖拽**: vuedraggable 4.1.0
- **验证码**: makeit-captcha 2.0.6
- **样式**: Sass, PostCSS, Autoprefixer
- **代码质量**: ESLint, Prettier, Stylelint, Vue TSC

## 项目结构

```
admin-web/
├── src/
│   ├── api/                    # API 接口
│   │   ├── axios/             # Axios 配置和拦截器
│   │   ├── blog/              # 博客相关 API
│   │   └── capital/           # 核心功能 API（用户、角色、菜单等）
│   ├── assets/                # 静态资源
│   ├── components/            # 公共组件
│   │   ├── app/              # 应用级组件（Provider、锁屏等）
│   │   ├── charts/           # 图表组件
│   │   ├── drag/             # 拖拽相关组件
│   │   ├── form/             # 表单组件
│   │   ├── table/            # 表格组件
│   │   └── transition/       # 过渡动画组件
│   ├── constant/             # 常量定义
│   ├── hooks/                # 自定义 Hooks
│   ├── layout/               # 布局组件
│   ├── plugins/              # 插件配置（Naive UI、指令等）
│   ├── router/               # 路由配置
│   ├── store/                # Pinia 状态管理
│   ├── styles/               # 样式文件
│   ├── types/                # TypeScript 类型定义
│   ├── utils/                # 工具函数
│   ├── views/                # 页面视图
│   │   ├── common/           # 公共页面（登录、设置等）
│   │   ├── dashboard/        # 仪表盘
│   │   │   └── odas-dashboard-fe/  # 嵌套的仪表盘项目
│   │   ├── example/          # 示例页面
│   │   ├── file/             # 文件管理
│   │   ├── money/            # 财务管理
│   │   ├── system/           # 系统管理（用户、角色、菜单等）
│   │   └── home/             # 首页
│   ├── App.vue               # 根组件
│   └── main.ts               # 应用入口
├── types/                    # 全局类型定义
├── mock/                     # Mock 数据
├── public/                   # 公共资源
└── manage/                   # 构建输出目录
```

### 嵌套项目

`src/views/dashboard/odas-dashboard-fe/` 是一个独立的前端项目，具有自己的构建配置和项目结构。它包含：
- 独立的 Vite 配置 (`vite.config.ts`)
- 独立的 TypeScript 配置
- 完整的前端应用结构（组件、路由、状态管理等）

## 开发指南

### 环境变量

项目使用多种环境配置文件：
- `.env` - 默认环境变量
- `.env.dev` - 开发环境
- `.env.dev-local` - 本地开发环境
- `.env.prod` - 生产环境
- `.env.prod-local` - 本地生产环境

关键环境变量：
- `VITE_APP_TITLE` - 应用标题
- `VITE_PUBLIC_PATH` - 公共路径
- `VITE_PORT` - 开发服务器端口
- `VITE_PROXY` - 代理配置（JSON 格式）
- `VITE_USE_MOCK` - 是否启用 Mock

### 开发服务器

启动开发服务器：
```bash
# 使用 dev-local 模式
npm run dev

# 使用 dev 模式
npm run dev:text

# 启用调试模式
npm run dev:debug

# 使用 prod-local 模式
npm run dev:prod
```

### 构建项目

```bash
# 构建生产版本
npm run build

# 预览构建结果
npm run preview
```

### 代码质量

```bash
# 运行 ESLint 检查和修复
npm run lint

# 运行 Stylelint 格式化
npm run lint:stylelint

# 类型检查
npm run build  # 包含 vue-tsc 检查
```

### 依赖管理

```bash
# 重新安装依赖（删除 node_modules 和 lock 文件后重新安装）
npm run reinstall
```

## 代码规范

### 文件命名
- Vue 组件：PascalCase，如 `UserInfo.vue`
- TypeScript 文件：kebab-case，如 `user-info.ts`
- 工具函数：kebab-case，如 `format-date.ts`

### 组件结构
```vue
<template>
  <!-- 模板内容 -->
</template>

<script lang="ts" setup>
// Composition API with <script setup>
</script>

<style lang="scss" scoped>
// 样式
</style>
```

### API 调用模式
使用 `await-to-js` 处理异步错误：
```typescript
import { to } from 'await-to-js';
import { getUserList } from '@/api/capital/user';

const [err, data] = await to(getUserList(params));
if (err) {
  // 错误处理
  return;
}
// 数据处理
```

### 状态管理
使用 Pinia 存储：
```typescript
// store/modules/user.ts
export const useUserStore = defineStore('user', {
  state: () => ({
    userInfo: null,
  }),
  actions: {
    async getUserInfo() {
      // 获取用户信息
    },
  },
});
```

## 关键功能模块

### 1. 权限管理
- 用户管理 (`/system/user`)
- 角色管理 (`/system/role`)
- 菜单管理 (`/system/menu`)

### 2. 内容管理
- 文章管理
- 分类管理 (`/system/category`)

### 3. 文件管理
- 图片上传和管理 (`/file/image`)

### 4. 财务管理
- 支付宝管理 (`/money/aliPay`)
- 微信支付管理 (`/money/weChat`)
- 银行卡管理 (`/money/bank`)
- 账单上传 (`/money/billUpload`)

### 5. 仪表盘
- 工作台 (`/dashboard/workplace`)
- 数据可视化 (`/dashboard/odas-dashboard-fe`)

## 注意事项

1. **路径别名**：
   - `@/*` -> `src/*`
   - `/#/*` -> `types/*`

2. **样式处理**：
   - 使用 Sass/SCSS 预处理器
   - 全局变量在 `src/styles/variable.scss` 中定义
   - 组件样式使用 `scoped` 属性

3. **TypeScript 配置**：
   - 严格模式启用
   - 路径别名配置在 `tsconfig.json` 中

4. **嵌套项目**：
   - `odas-dashboard-fe` 是独立项目，有自己的构建配置
   - 修改时需要进入对应目录或使用其独立配置

5. **Git 状态**：
   - 当前分支: HEAD
   - 主分支: main
   - 最近的修改涉及路由处理、菜单管理和文章管理功能

## 开发约定

1. **新功能开发**：
   - 在 `src/views/` 下创建对应的页面目录
   - 在 `src/api/` 下创建对应的 API 模块
   - 复杂的 UI 组件抽取到 `src/components/` 下

2. **组件开发**：
   - 使用 Composition API 和 `<script setup>` 语法
   - 复杂的逻辑抽取到自定义 Hooks (`src/hooks/`)
   - 使用 TypeScript 定义组件 Props 和 Emits

3. **状态管理**：
   - 全局状态使用 Pinia 存储
   - 模块化组织 Store（按功能划分）

4. **API 调用**：
   - 使用统一的 Axios 实例（`src/api/axios/`）
   - 错误处理统一在拦截器中处理
   - API 响应类型定义在 `types/` 目录下

## 扩展与维护

- 添加新环境：创建 `.env.[mode]` 文件并配置对应变量
- 添加新组件：遵循现有命名和结构约定
- 添加新页面：在 `src/views/` 创建目录，配置路由
- 添加新 API：在 `src/api/` 对应模块中创建函数

---

*最后更新: 2026-04-25*
*版本: 2.5.1*
