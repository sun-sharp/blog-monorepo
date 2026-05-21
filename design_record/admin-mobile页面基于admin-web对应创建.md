# admin-mobile页面基于admin-web对应创建

**Session ID:** ses_1b4ac7e8cffe6PH3246LZsO4FR
**Created:** 2026/5/22 00:17:04
**Updated:** 2026/5/22 00:46:37

---

## User

packages\admin-mobile 页面 根据 packages\admin-web 进行页面对应创建

---

## Assistant (Plan · GLM-5.1 · 134.3s)

_Thinking:_

The user wants to create pages in `packages/admin-mobile` based on the pages in `packages/admin-web`. I need to first understand the structure of both projects to create a plan. Let me explore the page structures of both projects.

我先了解一下这两个项目的页面结构。

**Tool: task**

**Input:**
```json
{
  "description": "Explore admin-web pages",
  "prompt": "Explore the directory structure of packages/admin-web/src/pages (or similar page directory). I need to understand:\n1. The full directory tree of all page files (list every .vue file)\n2. The routing configuration (look for router files)\n3. The general structure of a few representative pages to understand patterns used\n\nReturn a complete list of all page files with their paths, and the routing structure.",
  "subagent_type": "explore"
}
```

**Output:**
```
task_id: ses_1b4ac68fbffeFKxHNfMmqXG4hF (for resuming to continue this task if needed)

<task_result>
Now I have a complete picture. Here is the full report.

---

## Complete Directory Tree of `packages/admin-web/src/views/`

### 1. All Vue Files (50 total)

```
src/views/
├── about.vue
├── error-404.vue
├── iframe.vue
├── redirect.vue
│
├── blog/
│   ├── article.vue
│   ├── schedule.vue
│   ├── components/
│   │   ├── ArticleAddUpdateModel.vue
│   │   └── ScheduleAddUpdateModel.vue
│   └── hooks/
│       ├── useArticleAddUpdateModel.ts
│       ├── useArticleConfigure.ts
│       ├── useScheduleAddUpdateModel.ts
│       └── useScheduleConfigure.ts
│
├── common/
│   ├── login.vue
│   ├── setting-account.vue
│   └── setting-password.vue
│
├── dashboard/
│   ├── workplace.vue
│   ├── calendar.vue
│   └── components/
│       ├── FluxTrend.vue
│       ├── VisitAmount.vue
│       └── VisitTab.vue
│
├── example/
│   └── result/
│       ├── success.vue
│       ├── info.vue
│       └── fail.vue
│
├── file/
│   ├── image.vue
│   ├── components/
│   │   ├── ImageNotUseModel.vue
│   │   └── ImageOnlyPublicModel.vue
│   └── hooks/
│       ├── useImageConfigure.ts
│       ├── useImageNotUseModel.ts
│       └── useImageOnlyPublicModel.ts
│
├── home/
│   ├── index.vue
│   └── components/
│       ├── UserInfo.vue
│       ├── WaitForDoList.vue
│       └── WaitForDoSetting.vue
│
├── money/
│   ├── aliPay.vue
│   ├── bank.vue
│   ├── billUpload.vue
│   ├── weChat.vue
│   ├── amountSummary.vue
│   ├── components/
│   │   ├── AliPayUpdateModel.vue
│   │   ├── AliPayUploadFileModel.vue
│   │   ├── BankUpdateModel.vue
│   │   ├── BankUploadFileModel.vue
│   │   ├── BillUploadAddUpdateModel.vue
│   │   ├── BalanceTimeSelect.vue
│   │   ├── MoneyTimeTypeSelect.vue
│   │   ├── WeChatUpdateModel.vue
│   │   └── WeChatUploadFileModel.vue
│   └── hooks/
│       ├── useAliPayConfigure.ts
│       ├── useAliPayUpdateModel.ts
│       ├── useAliPayUploadFileModel.ts
│       ├── useBankConfigure.ts
│       ├── useBankUpdateModel.ts
│       ├── useBankUploadFileModel.ts
│       ├── useBillUploadAddUpdateModel.ts
│       ├── useBillUploadConfigure.ts
│       ├── useWeChatConfigure.ts
│       ├── useWeChatUpdateModel.ts
│       └── useWeChatUploadFileModel.ts
│
├── system/
│   ├── category.vue
│   ├── menu.vue
│   ├── role.vue
│   ├── user.vue
│   ├── components/
│   │   ├── CategoryAddUpdate.vue
│   │   ├── MenuAddUpdateModel.vue
│   │   ├── RoleAddUpdateModel.vue
│   │   └── UserAddUpdateModel.vue
│   └── hooks/
│       ├── useCategoryAddUpdate.ts
│       ├── useCategoryConfigure.ts
│       ├── useMenuAddUpdateModel.ts
│       ├── useMenuConfigure.ts
│       ├── useRoleAddUpdateModel.ts
│       ├── useRoleConfigure.ts
│       ├── useUserAddUpdateModel.ts
│       └── useUserConfigure.ts
│
└── tools/
    ├── componentIcon.vue
    └── transformHtml.vue
```

**Vue file count: 34 `.vue` files + 26 `.ts` hook files** (across 10 directories)

---

### 2. Routing Configuration

The routing system is **hybrid**: a small set of **static routes** registered at startup, plus **dynamic routes** fetched from the backend API at runtime based on the user's role.

#### 2a. Static (Constant) Routes

Defined in `packages/admin-web/src/router/index.ts` and `base.ts`:

| Route Name | Path | Component | Description |
|---|---|---|---|
| `Begin` | `/` | `Layout` | Root; redirects to `/home` |
| `Home` | `/home` | `views/home/index.vue` | Home page (child of Begin) |
| `Login` | `/login` | `views/common/login.vue` | Login page (no layout wrapper) |
| `RedirectPage` | `/redirect` | `Layout` | Redirect container |
| `RedirectPageSon` | `/redirect/:path(.*)` | `views/redirect.vue` | Redirect handler |
| `Setting` | `/setting` | `Layout` | Settings container; redirects to `/setting/account` |
| `SettingAccount` | `/setting/account` | `views/common/setting-account.vue` | Account settings |
| `SettingPassword` | `/setting/password` | `views/common/setting-password.vue` | Password settings |
| `ErrorPage` | `/:path(.*)*` | `Layout` | Catch-all 404 container |
| `ErrorPageSon` | `/:path(.*)*` | `views/error-404.vue` | 404 page |

#### 2b. Dynamic Routes (from Backend API)

The flow in `router-guards.ts`:

1. **Before each navigation**, check if user has a token.
2. If no token, redirect to `/login`.
3. If token exists and routes haven't been loaded yet:
   - Fetch user info via `userStore.GetInfo()`.
   - Fetch user config via `userStore.GetConfigInfo()`.
   - Call `routeStore.generateRoutes(userInfo)` which:
     - Calls `capitalApi.adminMenus(roleCode)` to get the menu tree from the backend.
     - Passes the menu data through `routerScreen()` (in `src/utils/menu.ts`):
       1. Filters to only `MAIN_DIRECTORY_VALUE`, `MENU_VALUE`, and `EMBEDDED_VALUE` menu types.
       2. Calls `routerGenerator()` which recursively builds `AppRouteRecordRaw[]` from the flat API menu list (using `parentId`/`menuId` to build the tree).
       3. Each route item uses `formatRouteComponent()` which dynamically imports the component using Vite's `import.meta.glob('../views/**/*.{vue,tsx}')` -- matching the `component` field from the backend (e.g., `/dashboard/workplace` maps to `../views/dashboard/workplace.vue`).
       4. Routes with `iframeSrc` use the `IframeComponent`.
       5. Top-level parent items (with `parentId === '0'` and no component match) get the `Layout` component.
       6. Calls `routerClassify()` which separates single-child routes (no children, no redirect) into a `PageRoute` wrapper under `/page`, and multi-child routes remain as standalone top-level routes.
     - Adds the generated routes via `router.addRoute()`.
4. Dynamic routes are added to Vue Router at runtime; they are not statically declared.

**Route path generation**: The `pathFormat()` function converts the `component` string from the backend (e.g., `/system/user`) into a route path using `toUnderscoreCase()`. For example:
- `component: "/system/user"` becomes path `/system/user`
- `component: "/money/aliPay"` becomes path `/money/ali_pay` (underscore conversion)

#### 2c. PAGE_ENUM Constants

From `packages/shared/src/constants/page-const.ts`:

| Key | Value |
|---|---|
| `LOGIN_PATH` | `/login` |
| `HOME_PATH` | `/home` |
| `PAGE_PATH` | `/page` |
| `SETTING_PATH` | `/setting` |
| `SETTING_ACCOUNT_PATH` | `/setting/account` |
| `SETTING_PASSWORD_PATH` | `/setting/password` |
| `REDIRECT_PATH` | `/redirect` |
| `ERROR_PAGE_NAME` | `ErrorPage` |

---

### 3. Page Structure Patterns

The project follows a very consistent pattern across all CRUD-style pages. Here are the three main patterns observed:

#### Pattern A: CRUD Table Page (most common)

Used by: `system/user.vue`, `system/role.vue`, `system/menu.vue`, `system/category.vue`, `blog/article.vue`, `blog/schedule.vue`, `money/bank.vue`, `money/aliPay.vue`, `money/weChat.vue`, `money/billUpload.vue`, `file/image.vue`

**Structure** (3-layer separation: View + Component + Hook):

```
views/{module}/
├── {pageName}.vue                  # Main page: thin, declarative
├── components/
│   └── {PageName}AddUpdateModel.vue  # Modal dialog for create/edit
└── hooks/
    ├── use{PageName}Configure.ts     # Table columns, search schemas, data loading
    └── use{PageName}AddUpdateModel.ts # Modal form state, validation, submit logic
```

**Main page** (e.g., `system/user.vue`):
```vue
<script lang="ts" setup>
  import FormSearch from '@/components/form/FormSearch.vue';
  import BasicTable from '@/components/table/BasicTable.vue';
  import UserAddUpdateModel from './components/UserAddUpdateModel.vue';
  import { useUserConfigure } from './hooks/useUserConfigure';

  const { addUpdateModelRef, actionRef, searchSchemas, columns,
          tableRowKey, searchSubmit, loadDataTable, reloadTable } = useUserConfigure();
</script>

<template>
  <n-card :bordered="false">
    <form-search :schemas="searchSchemas" @submit="searchSubmit" />
    <basic-table :columns="columns" :request="loadDataTable" :row-key="tableRowKey">
      <template #tableTitle>
        <n-button type="primary" @click="addUpdateModelRef.init()">新建</n-button>
      </template>
    </basic-table>
    <user-add-update-model ref="addUpdateModelRef" @refresh="reloadTable" />
  </n-card>
</template>
```

Key reusable components:
- `FormSearch` -- renders search form from schema definitions
- `BasicTable` -- renders data table with server-side pagination via `request` callback
- `{Name}AddUpdateModel` -- Naive UI `n-modal` for create/update, uses `defineExpose({ init })` so parent can open it

**Hook pattern** (e.g., `useUserConfigure.ts`):
- Returns `columns` (table column definitions), `searchSchemas` (search form schemas), `loadDataTable` (API fetch function), `reloadTable`, `searchSubmit`, and template refs.
- The `loadDataTable` function typically wraps an API call with pagination parameters.

**Modal component pattern** (e.g., `UserAddUpdateModel.vue`):
- Uses a dedicated hook (e.g., `useUserAddUpdateModel`) for all form state, validation rules, and submit logic.
- Exposes `init()` method so the parent can trigger "create" mode (no ID) or "edit" mode (with ID).
- Emits `refresh` event on successful submit so the parent table reloads.

#### Pattern B: Dashboard / Composite Page

Used by: `dashboard/workplace.vue`, `home/index.vue`

- Composes multiple child components within the same page.
- Uses `n-grid` for responsive layout.
- Data fetched directly in the page or child components (no shared hooks pattern).

#### Pattern C: Standalone Page

Used by: `common/login.vue`, `common/setting-account.vue`, `common/setting-password.vue`, `about.vue`, `error-404.vue`, `redirect.vue`, `iframe.vue`, `tools/componentIcon.vue`, `tools/transformHtml.vue`

- Self-contained single-file pages.
- No `components/` or `hooks/` subdirectories.
- Login page is the most complex, handling form validation and authentication directly.

---

### Summary of All Vue File Paths (Absolute)

**Top-level pages:**
1. `E:\program\Front\blog\blog-monorepo\packages\admin-web\src\views\about.vue`
2. `E:\program\Front\blog\blog-monorepo\packages\admin-web\src\views\error-404.vue`
3. `E:\program\Front\blog\blog-monorepo\packages\admin-web\src\views\iframe.vue`
4. `E:\program\Front\blog\blog-monorepo\packages\admin-web\src\views\redirect.vue`

**Blog module (4 Vue files):**
5. `E:\program\Front\blog\blog-monorepo\packages\admin-web\src\views\blog\article.vue`
6. `E:\program\Front\blog\blog-monorepo\packages\admin-web\src\views\blog\schedule.vue`
7. `E:\program\Front\blog\blog-monorepo\packages\admin-web\src\views\blog\components\ArticleAddUpdateModel.vue`
8. `E:\program\Front\blog\blog-monorepo\packages\admin-web\src\views\blog\components\ScheduleAddUpdateModel.vue`

**Common module (3 Vue files):**
9. `E:\program\Front\blog\blog-monorepo\packages\admin-web\src\views\common\login.vue`
10. `E:\program\Front\blog\blog-monorepo\packages\admin-web\src\views\common\setting-account.vue`
11. `E:\program\Front\blog\blog-monorepo\packages\admin-web\src\views\common\setting-password.vue`

**Dashboard module (5 Vue files):**
12. `E:\program\Front\blog\blog-monorepo\packages\admin-web\src\views\dashboard\workplace.vue`
13. `E:\program\Front\blog\blog-monorepo\packages\admin-web\src\views\dashboard\calendar.vue`
14. `E:\program\Front\blog\blog-monorepo\packages\admin-web\src\views\dashboard\components\VisitTab.vue`
15. `E:\program\Front\blog\blog-monorepo\packages\admin-web\src\views\dashboard\components\VisitAmount.vue`
16. `E:\program\Front\blog\blog-monorepo\packages\admin-web\src\views\dashboard\components\FluxTrend.vue`

**Example module (3 Vue files):**
17. `E:\program\Front\blog\blog-monorepo\packages\admin-web\src\views\example\result\success.vue`
18. `E:\program\Front\blog\blog-monorepo\packages\admin-web\src\views\example\result\info.vue`
19. `E:\program\Front\blog\blog-monorepo\packages\admin-web\src\views\example\result\fail.vue`

**File module (3 Vue files):**
20. `E:\program\Front\blog\blog-monorepo\packages\admin-web\src\views\file\image.vue`
21. `E:\program\Front\blog\blog-monorepo\packages\admin-web\src\views\file\components\ImageNotUseModel.vue`
22. `E:\program\Front\blog\blog-monorepo\packages\admin-web\src\views\file\components\ImageOnlyPublicModel.vue`

**Home module (4 Vue files):**
23. `E:\program\Front\blog\blog-monorepo\packages\admin-web\src\views\home\index.vue`
24. `E:\program\Front\blog\blog-monorepo\packages\admin-web\src\views\home\components\UserInfo.vue`
25. `E:\program\Front\blog\blog-monorepo\packages\admin-web\src\views\home\components\WaitForDoList.vue`
26. `E:\program\Front\blog\blog-monorepo\packages\admin-web\src\views\home\components\WaitForDoSetting.vue`

**Money module (14 Vue files):**
27. `E:\program\Front\blog\blog-monorepo\packages\admin-web\src\views\money\aliPay.vue`
28. `E:\program\Front\blog\blog-monorepo\packages\admin-web\src\views\money\bank.vue`
29. `E:\program\Front\blog\blog-monorepo\packages\admin-web\src\views\money\billUpload.vue`
30. `E:\program\Front\blog\blog-monorepo\packages\admin-web\src\views\money\weChat.vue`
31. `E:\program\Front\blog\blog-monorepo\packages\admin-web\src\views\money\amountSummary.vue`
32. `E:\program\Front\blog\blog-monorepo\packages\admin-web\src\views\money\components\AliPayUpdateModel.vue`
33. `E:\program\Front\blog\blog-monorepo\packages\admin-web\src\views\money\components\AliPayUploadFileModel.vue`
34. `E:\program\Front\blog\blog-monorepo\packages\admin-web\src\views\money\components\BankUpdateModel.vue`
35. `E:\program\Front\blog\blog-monorepo\packages\admin-web\src\views\money\components\BankUploadFileModel.vue`
36. `E:\program\Front\blog\blog-monorepo\packages\admin-web\src\views\money\components\BillUploadAddUpdateModel.vue`
37. `E:\program\Front\blog\blog-monorepo\packages\admin-web\src\views\money\components\BalanceTimeSelect.vue`
38. `E:\program\Front\blog\blog-monorepo\packages\admin-web\src\views\money\components\MoneyTimeTypeSelect.vue`
39. `E:\program\Front\blog\blog-monorepo\packages\admin-web\src\views\money\components\WeChatUpdateModel.vue`
40. `E:\program\Front\blog\blog-monorepo\packages\admin-web\src\views\money\components\WeChatUploadFileModel.vue`

**System module (8 Vue files):**
41. `E:\program\Front\blog\blog-monorepo\packages\admin-web\src\views\system\user.vue`
42. `E:\program\Front\blog\blog-monorepo\packages\admin-web\src\views\system\role.vue`
43. `E:\program\Front\blog\blog-monorepo\packages\admin-web\src\views\system\menu.vue`
44. `E:\program\Front\blog\blog-monorepo\packages\admin-web\src\views\system\category.vue`
45. `E:\program\Front\blog\blog-monorepo\packages\admin-web\src\views\system\components\UserAddUpdateModel.vue`
46. `E:\program\Front\blog\blog-monorepo\packages\admin-web\src\views\system\components\RoleAddUpdateModel.vue`
47. `E:\program\Front\blog\blog-monorepo\packages\admin-web\src\views\system\components\MenuAddUpdateModel.vue`
48. `E:\program\Front\blog\blog-monorepo\packages\admin-web\src\views\system\components\CategoryAddUpdate.vue`

**Tools module (2 Vue files):**
49. `E:\program\Front\blog\blog-monorepo\packages\admin-web\src\views\tools\componentIcon.vue`
50. `E:\program\Front\blog\blog-monorepo\packages\admin-web\src\views\tools\transformHtml.vue`

**Total: 50 Vue files** across 10 view directories, supported by 26 TypeScript hook files.
</task_result>
```

**Tool: task**

**Input:**
```json
{
  "description": "Explore admin-mobile pages",
  "prompt": "Explore the directory structure of packages/admin-mobile/src/pages (or similar page directory). I need to understand:\n1. The full directory tree of all existing page files (list every .vue file)\n2. The routing/pages configuration (look for pages.json or similar)\n3. The general structure of a few representative pages to understand patterns used\n\nReturn a complete list of all existing page files with their paths, and the routing/pages configuration.",
  "subagent_type": "explore"
}
```

**Output:**
```
task_id: ses_1b4ac6196ffeC0gZ4LZPBlfaJX (for resuming to continue this task if needed)

<task_result>
Here are my complete findings for `packages/admin-mobile`:

---

## 1. Complete List of All Page Files (.vue)

There is **exactly one** page file in the entire project:

| # | Absolute Path |
|---|---------------|
| 1 | `E:\program\Front\blog\blog-monorepo\packages\admin-mobile\pages\index\index.vue` |

**Important:** This is a uni-app project. Unlike the other projects in the monorepo, it has **no `src/` directory**. Pages live at the root-level `pages/` directory per uni-app convention. There are also **no components** yet -- the `components/` directory does not exist.

---

## 2. Routing / Pages Configuration (`pages.json`)

**File:** `E:\program\Front\blog\blog-monorepo\packages\admin-mobile\pages.json`

```json
{
  "pages": [
    {
      "path": "pages/index/index",
      "style": {
        "navigationBarTitleText": "uni-app"
      }
    }
  ],
  "globalStyle": {
    "navigationBarTextStyle": "black",
    "navigationBarTitleText": "uni-app",
    "navigationBarBackgroundColor": "#F8F8F8",
    "backgroundColor": "#F8F8F8"
  },
  "uniIdRouter": {}
}
```

Only a single route is registered: `pages/index/index` (the app launch page). No sub-packages, no tab bar, no navigation bar customizations beyond the defaults. This is the raw uni-app scaffold.

---

## 3. Representative Page Structure & Patterns

### `pages/index/index.vue` (the only page)

```vue
<template>
  <view class="content">
    <image class="logo" src="/static/logo.png"></image>
    <view class="text-area">
      <text class="title">{{ title }}</text>
    </view>
  </view>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  const title = ref('Hello');
</script>

<style>
  .content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  .logo {
    height: 200rpx;
    width: 200rpx;
    margin-top: 200rpx;
    margin-left: auto;
    margin-right: auto;
    margin-bottom: 50rpx;
  }
  .text-area {
    display: flex;
    justify-content: center;
  }
  .title {
    font-size: 36rpx;
    color: #8f8f94;
  }
</style>
```

**Patterns observed:**

| Pattern | Detail |
|---------|--------|
| **Script** | Uses `<script lang="ts" setup>` -- Composition API with TypeScript |
| **Template elements** | Uses uni-app native elements (`<view>`, `<text>`, `<image>`) instead of HTML (`<div>`, `<span>`, `<img>`) |
| **Sizing units** | Uses `rpx` (responsive pixel, 750rpx = screen width) instead of `px` |
| **Static assets** | Referenced from `/static/` root path |
| **Reactivity** | Standard `ref()` from Vue 3 |
| **Styles** | Plain `<style>` (not scoped, not SCSS) in this scaffold; `uni.scss` variables are auto-available in `<style lang="scss">` blocks |

---

## 4. Supporting Project Structure Context

```
packages/admin-mobile/
├── .env                          # VITE_APP_TITLE = 阳之锐移动端管理系统
├── .env.development              # Dev API: http://127.0.0.1:3000
├── .env.production               # Prod API: https://www.yangruirui.top
├── App.vue                       # Root app component (onLaunch/onShow/onHide)
├── main.ts                       # Entry point using createSSRApp (not createApp)
├── pages.json                    # Route configuration (uni-app equivalent of Vue Router)
├── manifest.json                 # App config (appid, platform settings, Vue 3)
├── uni.scss                      # Global SCSS variables (auto-injected)
├── env.d.ts                      # .vue module declarations
├── tsconfig.json                 # TypeScript config with path aliases
├── pages/
│   └── index/
│       └── index.vue             # The sole page
├── static/
│   └── logo.png                  # The sole static asset
└── (no components/ directory yet)
```

---

## Summary

The `admin-mobile` project is currently at **scaffold stage** -- it has only the default uni-app template page (`pages/index/index.vue`) with no custom pages, no components, and minimal routing configuration. The pattern it follows (and that new pages should follow) is:

1. Create a folder under `pages/` named after the feature (e.g., `pages/login/`)
2. Add a `.vue` file inside it (e.g., `login.vue`) using `<script lang="ts" setup>` + uni-app native elements + `rpx` units
3. Register the new path in `pages.json` under the `"pages"` array
4. Static assets go in `static/`
5. Shared components would go in a `components/` directory (not yet created)
</task_result>
```

---

## Assistant (Plan · GLM-5.1 · 200.5s)

_Thinking:_

Now I have a clear picture of both projects:

**admin-web** has 50 Vue files across these modules:
- Top-level: about, error-404, iframe, redirect
- blog: article, schedule (with components & hooks)
- common: login, setting-account, setting-password
- dashboard: workplace, calendar (with components)
- example/result: success, info, fail
- file: image (with components & hooks)
- home: index (with components)
- money: aliPay, bank, billUpload, weChat, amountSummary (with components & hooks)
- system: user, role, menu, category (with components & hooks)
- tools: componentIcon, transformHtml

**admin-mobile** currently only has the scaffold page `pages/index/index.vue`.

I need to plan the creation of corresponding pages in admin-mobile. The key differences:
1. admin-web uses Naive UI (web) vs admin-mobile uses uView Pro (uni-app)
2. admin-web uses Vue Router vs admin-mobile uses pages.json
3. admin-web uses web HTML elements vs admin-mobile uses uni-app native elements (`<view>`, `<text>`, etc.)
4. admin-web uses `px` vs admin-mobile uses `rpx`
5. admin-web has `views/` directory vs admin-mobile has `pages/` directory
6. admin-web uses modals (`n-modal`) vs admin-mobile uses pages/popup for forms

Let me think about which pages from admin-web should be mapped to admin-mobile. Not all pages make sense on mobile:
- about → could map
- error-404 → not needed (uni-app handles this differently)
- iframe → not applicable to mobile
- redirect → not needed
- blog/article → CRUD table page, needs mobile adaptation
- blog/schedule → CRUD table page
- common/login → yes, needed
- common/setting-account → yes
- common/setting-password → yes
- dashboard/workplace → dashboard/home
- dashboard/calendar → could be useful
- example/result → not essential
- file/image → yes, image management
- home/index → yes, home page
- money/* → financial pages
- system/* → admin pages
- tools/* → not essential for mobile

I should ask the user some clarifying questions about the scope and approach before making a detailed plan.

Key decisions to make:
1. Which admin-web pages should be mapped to mobile? (All? Only some?)
2. Should the mobile app use a tab bar navigation?
3. How should modals/dialogs from web be handled on mobile? (Navigate to new page? Bottom sheet/popup?)
4. Should hooks pattern be preserved in mobile?

Let me formulate the plan and ask the user.

现在我对这两个项目有了清晰的了解。在制定计划之前，请允许我提出几个澄清问题：

**Tool: question**

**Input:**
```json
{
  "questions": [
    {
      "header": "页面范围",
      "multiple": false,
      "options": [
        {
          "description": "映射所有模块：home, dashboard, blog, money, file, system, common, tools, example",
          "label": "全部映射"
        },
        {
          "description": "映射 home, dashboard, blog, money, file, system, common（排除 tools, example 等非核心页面）",
          "label": "核心业务页面"
        },
        {
          "description": "仅映射 home, dashboard, common（登录/设置）, blog 文章管理",
          "label": "基础页面优先"
        }
      ],
      "question": "admin-web 有 10 个模块（blog, common, dashboard, example, file, home, money, system, tools, 以及顶层页面）。哪些模块需要映射到移动端？"
    },
    {
      "header": "弹窗适配",
      "multiple": false,
      "options": [
        {
          "description": "uni-app 中新开一个页面来处理新增/编辑，提交后返回列表页",
          "label": "新页面导航 (Recommended)"
        },
        {
          "description": "使用 uView 的 u-popup 从底部弹出表单面板",
          "label": "底部弹出 Popup"
        },
        {
          "description": "简单表单用底部弹出，复杂表单用新页面",
          "label": "混合方式"
        }
      ],
      "question": "admin-web 中的 Modal 弹窗（新增/编辑表单）在移动端如何适配？"
    },
    {
      "header": "底部导航",
      "multiple": false,
      "options": [
        {
          "description": "首页、博客、财务、我的（4个 Tab）",
          "label": "4 Tab: 首页/博客/财务/我的"
        },
        {
          "description": "首页、我的（2个 Tab，其余通过菜单进入）",
          "label": "2 Tab: 首页/我的"
        },
        {
          "description": "所有页面通过侧边菜单或列表进入，无底部 TabBar",
          "label": "不用 TabBar"
        }
      ],
      "question": "移动端是否需要底部 TabBar 导航？如果需要，希望包含哪些 Tab？"
    },
    {
      "header": "Hooks模式",
      "multiple": false,
      "options": [
        {
          "description": "保持与 admin-web 一致的 hooks 分层模式，便于维护和代码复用",
          "label": "保留 hooks (Recommended)"
        },
        {
          "description": "移动端页面较简单，直接在组件中写逻辑，减少文件数量",
          "label": "内联逻辑"
        }
      ],
      "question": "是否保留 admin-web 的 hooks 分层模式（Configure hooks + Modal hooks）？"
    }
  ]
}
```

**Error:**
```
The user dismissed this question
```

---

## User

packages\admin-mobile 页面 根据 packages\admin-web 进行页面对应创建，UI库使用packages\admin-mobile\uni_modules\uview-pro里的

---

## Assistant (Plan · GLM-5.1 · 177.3s)

_Thinking:_

The user wants me to plan the creation of pages in `packages/admin-mobile` based on the pages in `packages/admin-web`, using the uView Pro UI library. I'm in plan mode, so I should only read, analyze, and plan - no edits.

Let me first understand the uView Pro components available, then create a comprehensive mapping plan.

让我先探索一下可用的 uView Pro 组件，并了解 admin-web 的页面结构，以便制定一个周密的计划。

**Tool: task**

**Input:**
```json
{
  "description": "Explore uView Pro components",
  "prompt": "Explore the uView Pro library in packages/admin-mobile/uni_modules/uview-pro. I need to understand:\n\n1. What components are available (list the component directories/names)\n2. Look at a few key components that would be useful for admin pages:\n   - Form components (input, select, textarea, upload, etc.)\n   - Table/List components\n   - Navigation components (tabbar, navbar, etc.)\n   - Modal/Popup components\n   - Layout components\n3. Check if there's a documentation or README\n\nReturn a comprehensive list of all available component names.",
  "subagent_type": "explore"
}
```

**Output:**
```
task_id: ses_1b4a457b0ffeQ5oGIma6O2h9Lm (for resuming to continue this task if needed)

<task_result>
Here is a comprehensive analysis of the uView Pro component library.

---

## uView Pro Library Overview

- **Location**: `E:\program\Front\blog\blog-monorepo\packages\admin-mobile\uni_modules\uview-pro`
- **Version**: 0.6.2
- **Framework**: Vue 3 + TypeScript, built for uni-app (multi-platform: H5, WeChat/Alipay/ByteDance mini-programs, Android, iOS, HarmonyOS)
- **Features**: Multi-theme support, dark mode, i18n (internationalization), easycom auto-import
- **Official Docs**: https://uviewpro.cn
- **Source**: https://github.com/anyup/uview-pro

---

## Complete Component List (99 components)

Below are **all** component directory names, organized into functional categories relevant to admin pages.

### 1. Form Components (16 components)

| Component | Tag | Key Props / Description |
|-----------|-----|-------------------------|
| **u-form** | `<u-form>` | `model`, `rules`, `errorType` (message/toast/border), `labelPosition` (left/top), `labelWidth`, `size` (default/small/large) |
| **u-form-item** | `<u-form-item>` | `label`, `prop`, `required`, `borderBottom`, `leftIcon`/`rightIcon`, `size` |
| **u-input** | `<u-input>` | `modelValue`, `type` (text/number/textarea), `placeholder`, `disabled`, `border`, `clearable`, `passwordIcon`, `maxlength`, `focus` |
| **u-textarea** | `<u-textarea>` | `modelValue`, `placeholder`, `count` (word count), `autoHeight`, `border` (surround/bottom), `clearable`, `maxlength` |
| **u-select** | `<u-select>` | `list`, `mode` (single-column/mutil-column/mutil-column-auto), `modelValue`, `valueName`/`labelName`/`childName`, `title` |
| **u-picker** | `<u-picker>` | `mode` (time/region/selector/multiSelector), `params`, `range`, `defaultTime`/`defaultRegion`/`areaCode` |
| **u-radio** | `<u-radio>` | `label`, `name`/`value`, `shape` (square/circle), `disabled`, `activeColor`, `size` |
| **u-radio-group** | `<u-radio-group>` | Wraps multiple `u-radio` for single selection |
| **u-checkbox** | `<u-checkbox>` | `label`, `name`/`value`, `modelValue`, `shape`, `disabled`, `activeColor`, `size` |
| **u-checkbox-group** | `<u-checkbox-group>` | Wraps multiple `u-checkbox` for multi selection |
| **u-switch** | `<u-switch>` | `modelValue`, `activeColor`/`inactiveColor`, `activeValue`/`inactiveValue`, `disabled`, `loading`, `vibrateShort` |
| **u-slider** | `<u-slider>` | `modelValue` (0-100), `min`/`max`/`step`, `activeColor`/`inactiveColor`, `disabled`, `showValue` |
| **u-rate** | `<u-rate>` | `modelValue`, `count`, `allowHalf`, `disabled`, `activeIcon`/`inactiveIcon`, `minCount` |
| **u-number-box** | `<u-number-box>` | `modelValue`, `min`/`max`/`step`, `disabled`, `disabledInput`, `positiveInteger`, `longPress` |
| **u-upload** | `<u-upload>` | `modelValue` (file list), `action` (upload URL), `accept` (image/video/file/media/all), `mode` (grid/list), `maxCount`, `maxSize`, `multiple`, `autoUpload`, `beforeUpload`/`beforeRemove`, `customChoose` |
| **u-calendar** | `<u-calendar>` | `mode` (date/range), `minDate`/`maxDate`, `defaultDate`, `showLunar`, `checkinMode`, `holidays`/`workdays`/`festivals` |

### 2. Data Display / Table / List Components (18 components)

| Component | Tag | Key Props / Description |
|-----------|-----|-------------------------|
| **u-table** | `<u-table>` | `borderColor`, `align`, `padding`, `fontSize`, `color`, `thStyle`, `bgColor` |
| **u-th** | `<u-th>` | Table header cell |
| **u-td** | `<u-td>` | Table data cell |
| **u-tr** | `<u-tr>` | Table row |
| **u-cell-group** | `<u-cell-group>` | Container for cell items |
| **u-cell-item** | `<u-cell-item>` | `icon`, `title`, `value`, `label`, `arrow`, `arrowDirection` (right/up/down), `required`, `borderBottom`, `center` |
| **u-loadmore** | `<u-loadmore>` | `status` (loadmore/loading/nomore), `iconType` (flower/circle), `loadText`, `isDot` |
| **u-skeleton** | `<u-skeleton>` | `loading`, `animate`, `rows`, `rowsWidth`/`rowsHeight`, `title`, `avatar` |
| **u-badge** | `<u-badge>` | `type` (primary/warning/success/error/info), `count`, `isDot`, `overflowCount`, `absolute` |
| **u-tag** | `<u-tag>` | `type`, `text`, `mode` (light/dark/plain), `shape` (square/circle), `closeable`, `size` (default/mini/medium) |
| **u-empty** | `<u-empty>` | `mode` (data etc.), `text`, `src` (custom image), `iconColor`, `iconSize`, `show` |
| **u-card** | `<u-card>` | Card container |
| **u-section** | `<u-section>` | Section title with optional right-side action |
| **u-line-progress** | `<u-line-progress>` | Line-style progress bar |
| **u-circle-progress** | `<u-circle-progress>` | Circular progress indicator |
| **u-count-to** | `<u-count-to>` | Animated number counter |
| **u-read-more** | `<u-read-more>` | Expandable text content |
| **u-divider** | `<u-divider>` | Divider line with optional text |

### 3. Navigation Components (9 components)

| Component | Tag | Key Props / Description |
|-----------|-----|-------------------------|
| **u-navbar** | `<u-navbar>` | `title`, `isBack`, `backIconName`/`backIconColor`, `backText`, `isFixed`, `background`, `immersive`, `customBack` |
| **u-tabbar** | `<u-tabbar>` | `modelValue`, `list` (TabbarItem[]), `activeColor`/`inactiveColor`, `midButton` (bulge), `beforeSwitch`, `hideTabBar` |
| **u-tabs** | `<u-tabs>` | `list` (TabsItem[]), `current`, `isScroll`, `activeColor`/`inactiveColor`, `barWidth`, `showBar`, `bold` |
| **u-tabs-swiper** | `<u-tabs-swiper>` | Tabs with swipeable content panels |
| **u-steps** | `<u-steps>` | `list` (StepsListItem[]), `current`, `mode` (dot/number), `direction` (row/column), `type` (primary/success/info/warning/error) |
| **u-step** | `<u-step>` | Individual step in steps |
| **u-subsection** | `<u-subsection>` | Segmented control / subsection selector |
| **u-index-list** | `<u-index-list>` | Alphabetical index list |
| **u-index-anchor** | `<u-index-anchor>` | Anchor for index list sections |

### 4. Modal / Popup / Overlay Components (10 components)

| Component | Tag | Key Props / Description |
|-----------|-----|-------------------------|
| **u-popup** | `<u-popup>` | `show`/`modelValue`, `mode` (left/right/top/bottom/center), `length`, `mask`, `maskCloseAble`, `closeable`, `closeIconPos`, `borderRadius`, `safeAreaInsetBottom` |
| **u-modal** | `<u-modal>` | `modelValue`, `title`, `content`, `showConfirmButton`/`showCancelButton`, `confirmText`/`cancelText`, `asyncClose`, `maskCloseAble`, `zoom`, `global`/`page` (for `useModal()`) |
| **u-toast** | `<u-toast>` | `type` (success/warning/error/loading/default), `duration`, `position` (center/top/bottom), `icon`, `global`/`page` (for `useToast()`) |
| **u-action-sheet** | `<u-action-sheet>` | `modelValue`, `list` (ActionSheetItem[]), `tips`, `cancelBtn`, `maskCloseAble`, `asyncClose` |
| **u-mask** | `<u-mask>` | Overlay mask / backdrop |
| **u-loading-popup** | `<u-loading-popup>` | Loading popup overlay |
| **u-dropdown** | `<u-dropdown>` | `activeColor`/`inactiveColor`, `height`, `duration`, `closeOnClickMask`/`closeOnClickSelf` |
| **u-dropdown-item** | `<u-dropdown-item>` | Individual dropdown menu item |
| **u-alert-tips** | `<u-alert-tips>` | Alert tip popup |
| **u-top-tips** | `<u-top-tips>` | Top notification tip |

### 5. Layout Components (10 components)

| Component | Tag | Key Props / Description |
|-----------|-----|-------------------------|
| **u-row** | `<u-row>` | `gutter`, `justify` (start/end/center/around/between), `align` (top/center/bottom) |
| **u-col** | `<u-col>` | `span` (1-12 column grid) |
| **u-grid** | `<u-grid>` | `col` (number of columns), `border`, `align` (left/center/right) |
| **u-grid-item** | `<u-grid-item>` | Individual grid cell |
| **u-gap** | `<u-gap>` | Spacing gap between elements |
| **u-sticky** | `<u-sticky>` | `offsetTop`, `enable`, `bgColor`, `zIndex` -- sticky positioning |
| **u-line** | `<u-line>` | Horizontal/vertical line separator |
| **u-status-bar** | `<u-status-bar>` | System status bar placeholder |
| **u-safe-bottom** | `<u-safe-bottom>` | Bottom safe area placeholder (iPhone X) |
| **u-full-screen** | `<u-full-screen>` | Full-screen container |

### 6. Feedback / Status Indicators (8 components)

| Component | Tag | Key Props / Description |
|-----------|-----|-------------------------|
| **u-button** | `<u-button>` | `type` (default/primary/error/warning/success), `size` (default/large/medium/mini), `shape` (square/circle), `plain`, `disabled`, `loading`, `ripple`, `openType` |
| **u-loading** | `<u-loading>` | Loading spinner |
| **u-swipe-action** | `<u-swipe-action>` | `options` (SwipeActionOption[]), `btnWidth`, `disabled`, `show`, `vibrateShort` -- left-swipe to reveal actions |
| **u-notice-bar** | `<u-notice-bar>` | `list`, `type` (primary/success/error/warning/info), `mode` (horizontal/vertical), `autoplay`, `speed`, `volumeIcon` |
| **u-column-notice** | `<u-column-notice>` | Vertical scrolling notice |
| **u-row-notice** | `<u-row-notice>` | Horizontal scrolling notice |
| **u-no-network** | `<u-no-network>` | No network connection prompt |
| **u-count-down** | `<u-count-down>` | Countdown timer |

### 7. Media / Display Components (6 components)

| Component | Tag | Key Props / Description |
|-----------|-----|-------------------------|
| **u-image** | `<u-image>` | Image with loading/error states |
| **u-avatar** | `<u-avatar>` | Avatar display |
| **u-avatar-cropper** | `<u-avatar-cropper>` | Avatar cropping tool |
| **u-swiper** | `<u-swiper>` | Carousel / swiper |
| **u-lazy-load** | `<u-lazy-load>` | Lazy-loaded content |
| **u-waterfall** | `<u-waterfall>` | Waterfall/masonry layout |

### 8. Keyboard / Input Helpers (4 components)

| Component | Tag | Key Props / Description |
|-----------|-----|-------------------------|
| **u-keyboard** | `<u-keyboard>` | General virtual keyboard |
| **u-number-keyboard** | `<u-number-keyboard>` | Numeric keypad |
| **u-car-keyboard** | `<u-car-keyboard>` | Car license plate keyboard |
| **u-message-input** | `<u-message-input>` | Verification code input (separate character boxes) |

### 9. Utility / Other Components (18 components)

| Component | Tag | Key Props / Description |
|-----------|-----|-------------------------|
| **u-icon** | `<u-icon>` | Icon component (built-in `uicon` prefix) |
| **u-search** | `<u-search>` | `modelValue`, `shape` (round/square), `placeholder`, `showAction`, `actionText`, `clearabled`, `disabled` |
| **u-link** | `<u-link>` | Hyperlink with navigation |
| **u-back-top** | `<u-back-top>` | Back-to-top button |
| **u-fab** | `<u-fab>` | Floating action button |
| **u-config-provider** | `<u-config-provider>` | Theme/locale configuration provider |
| **u-root-portal** | `<u-root-portal>` | Render content at root level (for modals/toasts) |
| **u-transition** | `<u-transition>` | Transition animations |
| **u-collapse** | `<u-collapse>` | Collapsible accordion container |
| **u-collapse-item** | `<u-collapse-item>` | Individual collapse panel |
| **u-city-select** | `<u-city-select>` | Province/city/district selector |
| **u-verification-code** | `<u-verification-code>` | Verification code with countdown |
| **u-pagination** | `<u-pagination>` | `total`, `pageSize`, `prevText`/`nextText`, `showIcon` |
| **u-field** | `<u-field>` | Legacy field input (predecessor to form-item) |
| **u-time-line** | `<u-time-line>` | Timeline container |
| **u-time-line-item** | `<u-time-line-item>` | Individual timeline entry |
| **u-text** | `<u-text>` | Rich text display |
| **u-slider** | *(already listed in Form)* | Slider selector |

---

## Documentation

- **Local README**: `E:\program\Front\blog\blog-monorepo\packages\admin-mobile\uni_modules\uview-pro\readme.md` -- contains installation, configuration, and quick-start instructions
- **Changelog**: `E:\program\Front\blog\blog-monorepo\packages\admin-mobile\uni_modules\uview-pro\changelog.md` -- detailed version history (1583 lines)
- **Official Documentation**: https://uviewpro.cn -- comprehensive component API docs with examples
- **Quick Start Template**: https://starter.uviewpro.cn

---

## Key Highlights for Admin Page Development

1. **Full Form System**: `u-form` + `u-form-item` provide validation (`rules`), error display modes (`message`/`toast`/`border`), and label positioning. Combine with `u-input`, `u-textarea`, `u-select`, `u-radio`/`u-radio-group`, `u-checkbox`/`u-checkbox-group`, `u-switch`, `u-picker`, `u-calendar`, `u-upload`, `u-number-box` for complete admin forms.

2. **Data Tables**: `u-table` + `u-tr` + `u-th` + `u-td` provide basic table rendering, though note this is a simple mobile-oriented table (no built-in sorting/filtering/pagination -- use `u-pagination` separately).

3. **List Patterns**: `u-cell-group` + `u-cell-item` are the primary pattern for mobile admin lists (settings, details, navigation items). `u-loadmore` handles infinite scroll states. `u-swipe-action` adds left-swipe delete/actions.

4. **Navigation**: `u-navbar` for custom page headers, `u-tabbar` for bottom navigation, `u-tabs` for tab switching within pages, `u-steps` for wizard/step flows.

5. **Modals & Feedback**: `u-popup` (multi-direction drawer), `u-modal` (dialog), `u-action-sheet` (bottom menu), `u-toast` (notification), `u-dropdown` (filter menus).

6. **Layout**: `u-row` + `u-col` (12-column grid), `u-grid` + `u-grid-item` (dashboard grids), `u-sticky` (sticky headers), `u-skeleton` (loading placeholders).

7. **Programmatic APIs**: `u-modal` and `u-toast` support `global`/`page` props for use with `useModal()` / `useToast()` composables (no need for template refs).
</task_result>
```

**Tool: task**

**Input:**
```json
{
  "description": "Explore admin-web page details",
  "prompt": "Read the following key admin-web pages to understand their structure, API calls, and functionality. For each page, note:\n- What API calls are made\n- What data is displayed\n- What actions are available (CRUD, search, etc.)\n- What form fields exist\n\nRead these files:\n1. packages/admin-web/src/views/blog/article.vue\n2. packages/admin-web/src/views/blog/hooks/useArticleConfigure.ts\n3. packages/admin-web/src/views/blog/hooks/useArticleAddUpdateModel.ts\n4. packages/admin-web/src/views/blog/components/ArticleAddUpdateModel.vue\n5. packages/admin-web/src/views/system/user.vue\n6. packages/admin-web/src/views/system/hooks/useUserConfigure.ts\n7. packages/admin-web/src/views/system/hooks/useUserAddUpdateModel.ts\n8. packages/admin-web/src/views/system/components/UserAddUpdateModel.vue\n9. packages/admin-web/src/views/system/role.vue\n10. packages/admin-web/src/views/system/hooks/useRoleConfigure.ts\n11. packages/admin-web/src/views/system/menu.vue\n12. packages/admin-web/src/views/system/hooks/useMenuConfigure.ts\n13. packages/admin-web/src/views/system/category.vue\n14. packages/admin-web/src/views/system/hooks/useCategoryConfigure.ts\n15. packages/admin-web/src/views/file/image.vue\n16. packages/admin-web/src/views/file/hooks/useImageConfigure.ts\n17. packages/admin-web/src/views/money/bank.vue\n18. packages/admin-web/src/views/money/hooks/useBankConfigure.ts\n19. packages/admin-web/src/views/money/aliPay.vue\n20. packages/admin-web/src/views/money/hooks/useAliPayConfigure.ts\n21. packages/admin-web/src/views/money/weChat.vue\n22. packages/admin-web/src/views/money/hooks/useWeChatConfigure.ts\n23. packages/admin-web/src/views/money/billUpload.vue\n24. packages/admin-web/src/views/money/hooks/useBillUploadConfigure.ts\n25. packages/admin-web/src/views/money/amountSummary.vue\n26. packages/admin-web/src/views/blog/schedule.vue\n27. packages/admin-web/src/views/blog/hooks/useScheduleConfigure.ts\n28. packages/admin-web/src/views/home/index.vue\n29. packages/admin-web/src/views/common/login.vue\n30. packages/admin-web/src/views/common/setting-account.vue\n31. packages/admin-web/src/views/common/setting-password.vue\n32. packages/admin-web/src/views/dashboard/workplace.vue\n\nReturn a summary for each page with: API calls, displayed data, actions, and form fields.",
  "subagent_type": "explore"
}
```

**Output:**
```
task_id: ses_1b4a4319effeKZGeOsxUw5yYCi (for resuming to continue this task if needed)

<task_result>
Now I have all the data. Here is the comprehensive summary for each page:

---

## 1. Blog - Article Management (`blog/article.vue` + hooks + component)

**API Calls:**
- `articleAPi.getFindPage(params)` -- paginated list of articles
- `articleAPi.remove(articleId)` -- delete an article
- `articleAPi.exportArticle(articleId, fileName)` -- export article as PDF
- `articleAPi.batchUpdatePrivate(params)` -- batch toggle privacy (encrypt/unencrypt)
- `articleAPi.save(postData)` -- create new article
- `articleAPi.update({ articleId, ...postData })` -- update existing article
- `getArticleCategoryData()` -- load article category options (on mount/activate)

**Displayed Data (Table Columns):**
- Article title, brief/intro, category name (resolved from ID), creation time, isPrivate (encrypted yes/no)

**Actions:**
- **Search** by: keywords, category (select), isPrivate (select: encrypted/unencrypted)
- **Create** new article (opens full-screen modal)
- **Edit** article (opens full-screen modal with pre-filled data)
- **Delete** article (with confirmation popconfirm)
- **Export** article as PDF
- **Batch encrypt** selected rows
- **Batch unencrypt** selected rows
- Row selection (checkbox) enables batch privacy toggle buttons

**Form Fields (Add/Update Modal):**
- `title` (NInput, required, 2-30 chars)
- `brief` (NInput textarea, required, min 5 chars, max 300)
- `categoryVal` (NSelect, required, filterable, populated from category API)
- `markdownContent` (MdEditorInput, required, custom validator ensuring both markdown and HTML exist)
- Also tracked but not directly input: `htmlContent`, `cssContent` (generated by markdown editor)
- Two save buttons: "Save" (isPrivate=false) and "Encrypted Save" (isPrivate=true)

---

## 2. System - User Management (`system/user.vue` + hooks + component)

**API Calls:**
- `userApi.getPage(params)` -- paginated user list
- `capitalApi.removeUser(userId)` -- delete a user
- `userApi.updateRoleCode({ userId, roleCode })` -- update user's role (edit mode)
- `capitalApi.signUp({ nickname, avatar, username, roleCode, password })` -- create new user (sign up)
- `roleApi.getAll()` -- fetch all roles for the role select dropdown

**Displayed Data (Table Columns):**
- Nickname, avatar (NAvatar image), username, last login time, role code

**Actions:**
- **Search** by: nickname, username
- **Create** new user (opens modal with full registration form)
- **Edit/Modify role** (opens modal, only roleCode is editable for existing users; nickname/avatar/username are disabled)
- **Delete** user (with confirmation)

**Form Fields (Add/Update Modal):**
- `nickname` (NInput, required; disabled when editing)
- `avatar` (FormUploadImage, max 1 image, source="user_avatar"; disabled when editing)
- `username` (NInput, required, regex validated `^[a-z][a-z_`~@*|()+-]{3,40}$`; disabled when editing)
- `roleCode` (NSelect, required, populated from roleApi.getAll())
- `password` (NInput password, required; only shown when creating new user)
- `verifyPassword` (NInput password, required, must match password; only shown when creating new user)

---

## 3. System - Role Management (`system/role.vue` + hooks)

**API Calls:**
- `roleApi.getPage(params)` -- paginated role list
- `roleApi.remove(roleId)` -- delete a role

**Displayed Data (Table Columns):**
- Role name, role code, role type (rendered via `roleTypeObj` mapping)

**Actions:**
- **Search** by: name, roleCode
- **Create** new role (opens AddUpdateModel modal)
- **Edit** role (opens AddUpdateModel modal)
- **Delete** role (with confirmation)

**Form Fields:** (defined in `RoleAddUpdateModel.vue`, not read but inferred from context)
- Likely: name, roleCode, roleType

---

## 4. System - Menu Management (`system/menu.vue` + hooks)

**API Calls:**
- `menuApi.getMenuList()` -- fetch all menus (flat list, then transformed to tree via `levelMenu()`)
- `menuApi.removeMenu(menuId)` -- delete a menu

**Displayed Data (Table Columns, tree table):**
- Name, identifier (name field), icon (rendered via `constantHtmlIcon` mapping), type (NTag with color from `menuTagTypeNameObj`), sort order, menu URL (component/iframeSrc/name depending on type), isHidden (yes/no), isKeepAlive (yes/no)

**Actions:**
- **Search** by: title (client-side filter via `filterMenuByParams`)
- **Create** new menu (opens MenuAddUpdateModel modal)
- **Edit** menu (opens MenuAddUpdateModel modal)
- **Delete** menu (with confirmation)
- **Expand/collapse** tree rows
- Table toolbar: density control, reload

**Form Fields:** (defined in `MenuAddUpdateModel.vue`, not read)
- Likely: title, name, icon, menuType, sort, component, iframeSrc, hidden, keepAlive, parentId

---

## 5. System - Category Management (`system/category.vue` + hooks)

**API Calls:**
- `categoryApi.getPage(params)` -- paginated category list
- `categoryApi.remove(categoryId)` -- delete a category
- `apiTypeStore.againGetApiType(row.type)` -- refresh shared type store after deletion

**Displayed Data (Table Columns):**
- Category type (resolved from `categoryTypeOption`), category value (numeric identifier), category value string, category label (display name)

**Actions:**
- **Search** by: type (NSelect from `categoryTypeOption`), label (NInput)
- **Create** new category (opens CategoryAddUpdate modal)
- **Edit** category (opens CategoryAddUpdate modal)
- **Delete** category (direct button, no confirmation popconfirm)

**Form Fields:** (defined in `CategoryAddUpdate.vue`, not read)
- Likely: type, value, valueStr, label

---

## 6. File - Image Management (`file/image.vue` + hooks)

**API Calls:**
- `imageApi.getPage(params)` -- paginated image list
- `imageApi.removePublicAndData(imageId)` -- delete image file + database record (when file exists)
- `imageApi.removeData(imageId)` -- delete database record only (when file doesn't exist)
- `getImageSourceData()` -- load image source options (on mount)

**Displayed Data (Table Columns):**
- Image name, image display (NImage thumbnail), full file name, image type, image source (resolved from options), upload time

**Actions:**
- **Search** by: name, source (NSelect with "All" + dynamic options)
- **Process images with only file data** (opens `ImageOnlyPublicModel`)
- **Find unused images** (opens `ImageNotUseModel`)
- **Delete image and data** (when file exists on disk, with confirmation)
- **Delete data only** (when file does not exist on disk, with confirmation)

**Form Fields:** None on the main page; modals handle their own forms.

---

## 7. Money - Bank Bill Management (`money/bank.vue` + hooks)

**API Calls:**
- `bankApi.getPage(params)` -- paginated bank bill list
- `bankApi.remove(bankId)` -- delete a bank bill
- `getBillTypeData()` -- load bill type options (on mount)
- `getBankTypeData()` -- load bank type options (on mount)

**Displayed Data (Table Columns):**
- Trade time, trade type, bank type (resolved from options), trade counterparty, counterparty remarks, trade amount (prefixed with "Y"), balance (prefixed with "Y"), bank bill type (resolved from map), inflow/outflow (resolved from map)

**Actions:**
- **Search** by: tradeTime (NDatePicker), tradeOtherPerson, inflowOrOutflow (NSelect), bankType (NSelect), bankBillType (NSelect)
- **Import** bank bills from file (opens BankUploadFileModel)
- **Edit** bank bill (opens BankUpdateModel)
- **Delete** bank bill (with confirmation)

**Form Fields:** (in BankUpdateModel / BankUploadFileModel, not read)
- Likely: tradeTime, tradeType, bankType, tradeOtherPerson, tradeOtherPersonRemarks, moneyAmount, balance, bankBillType, inflowOrOutflow

---

## 8. Money - AliPay Bill Management (`money/aliPay.vue` + hooks)

**API Calls:**
- `aliPayApi.getPage(params)` -- paginated AliPay bill list
- `aliPayApi.updateBalance(params)` -- recalculate balance for a date range
- `aliPayApi.updateBalanceBaby(params)` -- recalculate YuEBao (balance baby) for a date range
- `getBillTypeData()` -- load bill type options (on mount)
- `getBillMethodData()` -- load bill method options (on mount)

**Displayed Data (Table Columns):**
- Trade time, trade type, trade counterparty, counterparty remarks, amount (prefixed "Y"), balance (prefixed "Y"), YuEBao/balanceBaby (prefixed "Y"), inflow/outflow (resolved), bill method (resolved), bill type (resolved)

**Actions:**
- **Search** by: tradeTime (NDatePicker), tradeOtherPerson, inflowOrOutflow (NSelect), billMethod (NSelect), billType (NSelect)
- **Import** AliPay bills from file (opens AliPayUploadFileModel)
- **Process balance** (opens BalanceTimeSelect to pick date range, then calls `updateBalance`)
- **Process YuEBao** (opens BalanceTimeSelect to pick date range, then calls `updateBalanceBaby`)
- **Edit** AliPay bill (opens AliPayUpdateModel, no delete action)

**Form Fields:** (in AliPayUpdateModel / AliPayUploadFileModel, not read)

---

## 9. Money - WeChat Bill Management (`money/weChat.vue` + hooks)

**API Calls:**
- `weChatApi.getPage(params)` -- paginated WeChat bill list
- `weChatApi.updateBalance(params)` -- recalculate balance (change pocket) for a date range
- `getBillTypeData()` -- load bill type options (on mount)
- `getBillMethodData()` -- load bill method options (on mount)

**Displayed Data (Table Columns):**
- Trade time, trade type, trade counterparty, counterparty remarks, amount (prefixed "Y"), balance (prefixed "Y"), inflow/outflow (resolved), bill method (resolved), bill type (resolved)

**Actions:**
- **Search** by: tradeTime (NDatePicker), tradeOtherPerson, inflowOrOutflow (NSelect), billMethod (NSelect), billType (NSelect)
- **Import** WeChat bills from file (opens WeChatUploadFileModel)
- **Process pocket balance** (opens BalanceTimeSelect to pick date range, then calls `updateBalance`)
- **Edit** WeChat bill (opens WeChatUpdateModel, no delete action)

**Form Fields:** (in WeChatUpdateModel / WeChatUploadFileModel, not read)

---

## 10. Money - Bill Upload Rules (`money/billUpload.vue` + hooks)

**API Calls:**
- `billUploadApi.getPage(params)` -- paginated bill upload rule list
- `billUploadApi.remove(billUploadId)` -- delete a bill upload rule
- `getBillTypeData()` -- load bill type options (on mount)
- `getBillMethodData()` -- load bill method options (on mount)

**Displayed Data (Table Columns):**
- Bill upload type (resolved from `billUploadTypeMap`), handle type (resolved from `handleTypeMap`), inflow/outflow (resolved), bill type (resolved from options), bill method (resolved from options), bill judge key, judge way

**Actions:**
- **Search** by: billUploadType (NSelect), handleType (NSelect), billType (NSelect, dynamically shown when handleType=billType), billMethod (NSelect, dynamically shown when handleType=billMethod), judgeWay (NSelect)
- **Create** new bill upload rule (opens BillUploadAddUpdateModel)
- **Edit** bill upload rule (opens BillUploadAddUpdateModel)
- **Delete** bill upload rule (with confirmation)

**Form Fields:** (in BillUploadAddUpdateModel, not read)
- Likely: billUploadType, handleType, inflowOrOutflow, billType, billMethod, billJudgeKey, judgeWay

---

## 11. Money - Amount Summary (`money/amountSummary.vue`)

**API Calls:**
- `moneyApi.statisticsMoneyBalance()` -- get balance data for pie chart (all payment methods)
- `moneyApi.getStatisticsBankFlow(params)` -- get bank flow statistics for a date range
- `moneyApi.statisticsInflowOrOutflowMoney(params)` -- get inflow/outflow money statistics by method for a date range

**Displayed Data:**
- **Pie Chart**: Balance amounts across all payment methods (inner pie chart with labels)
- **Bank Flow List**: Per-bank: name, start balance, end balance, inflow amount, outflow amount, voucher count
- **Inflow Column Chart**: Bar chart of inflow amounts by method + total inflow sum
- **Outflow Column Chart**: Bar chart of outflow amounts by method + total outflow sum

**Actions:**
- **Change time range** for bank flow (via MoneyTimeTypeSelect with preset ranges and custom date picker)
- **Change time range** for inflow/outflow charts (via MoneyTimeTypeSelect)

**Form Fields:** None; uses time range selectors (MoneyTimeTypeSelect component)

---

## 12. Blog - Schedule Management (`blog/schedule.vue` + hooks)

**API Calls:**
- `scheduleAPi.getFindPage(params)` -- paginated schedule list
- `scheduleAPi.remove(scheduleId)` -- delete a schedule

**Displayed Data (Table Columns):**
- Title, content, start date, end date, start time, end time

**Actions:**
- **Search** by: keywords
- **Create** new schedule (opens ScheduleAddUpdateModel)
- **Edit** schedule (opens ScheduleAddUpdateModel)
- **Delete** schedule (with confirmation)
- Row selection (checkbox available but no batch action implemented)

**Form Fields:** (in ScheduleAddUpdateModel, not read)
- Likely: title, content, startDate, endDate, startTime, endTime

---

## 13. Home Page (`home/index.vue` + sub-components)

**API Calls (from WaitForDoList component):**
- `waitForDoApi.classifyAll(classify, state)` -- get all to-do items by classification and state
- `waitForDoApi.updateSort(paramsArr)` -- update sort order after drag-and-drop
- `waitForDoApi.updateState({ waitForDoId, state })` -- toggle to-do item state (1=active, 2=completed)
- `waitForDoApi.save(postData)` -- create new to-do item
- `getWaitForDoClassifyData()` -- load to-do classification options

**Displayed Data:**
- **UserInfo card**: username, avatar (NAvatar), role name, last login time (relative format)
- **WaitForDoList**: To-do items with title, remark, deadline, state (active/completed), draggable list with checkbox per item

**Actions:**
- **Select classification** (NSelect dropdown) to filter to-do items
- **Add new to-do** (input with Enter key, optional deadline via date picker)
- **Toggle state** (checkbox to mark complete/incomplete)
- **Drag-and-drop reorder** (vuedraggable, saves new sort order)
- **Click item** to open detail/edit (WaitForDoSetting modal)
- **Tab switch** between "In Progress" (state=1) and "Completed" (state=2)

**Form Fields (inline add):**
- `title` (NInput)
- `classify` (from selected classification)
- `deadline` (NDatePicker, optional, datetime format)
- `state` (defaulted to 1)

---

## 14. Common - Login Page (`common/login.vue`)

**API Calls:**
- `userStore.login({ username, password })` -- authenticate user (calls backend API via Pinia store)

**Displayed Data:**
- App logo, app title, short name description, login form

**Actions:**
- **Login** (submit form with username + password)

**Form Fields:**
- `username` (NInput, required, with person icon prefix)
- `password` (NInput password, required, show-on-click, with lock icon prefix)
- `isCaptcha` (boolean, currently disabled/commented out -- was for captcha verification)

---

## 15. Common - Setting Account (`common/setting-account.vue`)

**API Calls:**
- `userApi.updateUserInfo({ nickname, username, avatar })` -- update current user's profile
- Reads from `userStore.getUserInfo` for initialization

**Displayed Data:**
- Current user's nickname, username, avatar (pre-populated in form)

**Actions:**
- **Update basic info** (submit form)

**Form Fields:**
- `nickname` (NInput, required)
- `username` (NInput, required)
- `avatar` (FormUploadImage, max 1 image, source="user_avatar")

---

## 16. Common - Setting Password (`common/setting-password.vue`)

**API Calls:**
- `userApi.updateUserPassword({ password, updatePassword })` -- change current user's password

**Displayed Data:**
- Current username (disabled/read-only)

**Actions:**
- **Change password** (submit form)

**Form Fields:**
- `username` (NInput, disabled, auto-filled from current user)
- `password` (NInput password, required, current password)
- `updatePassword` (NInput password, required, new password)
- `confirmPassword` (NInput password, required, must match updatePassword; disabled until updatePassword has input)

---

## 17. Dashboard - Workplace (`dashboard/workplace.vue`)

**API Calls:**
- `homeApi.getConsoleInfo()` -- **currently commented out**; would fetch visits, saleroom, orderLarge, volume data

**Displayed Data (all currently empty/static since API is commented out):**
- **4 stat cards** in a grid: Visits (daily visits, day/week comparison), Sales (weekly sales, progress bar), Orders (weekly orders, conversion rate), Transaction volume (monthly, comparison)
- **8 navigation/icon cards**: User, Analysis, Product, Order, Invoice, Message, Tags, Config (all with click handlers that do nothing)
- **VisitTab component** (likely a chart/tab view for visit trends)

**Actions:**
- No interactive actions currently (API calls are commented out; all icon clicks are empty functions)

**Form Fields:** None

---

## Summary Table

| Page | Primary API Module | Key CRUD | Search Fields | Special Features |
|------|-------------------|----------|---------------|-----------------|
| Article | `articleAPi` | Full CRUD + Export | keywords, category, isPrivate | Markdown editor, batch privacy toggle |
| User | `userApi`/`capitalApi` | Full CRUD | nickname, username | Role assignment, avatar upload |
| Role | `roleApi` | Full CRUD | name, roleCode | Role type display |
| Menu | `menuApi` | Full CRUD (tree) | title (client filter) | Tree table, expandable rows |
| Category | `categoryApi` | Full CRUD | type, label | Shared type store refresh on delete |
| Image | `imageApi` | Read + Delete | name, source | Dual delete (file+data vs data-only), unused image finder |
| Bank | `bankApi` | Read + Update + Delete + Import | tradeTime, tradeOtherPerson, inflowOrOutflow, bankType, bankBillType | File import for bills |
| AliPay | `aliPayApi` | Read + Update + Import | tradeTime, tradeOtherPerson, inflowOrOutflow, billMethod, billType | Balance/YuEBao processing, file import |
| WeChat | `weChatApi` | Read + Update + Import | tradeTime, tradeOtherPerson, inflowOrOutflow, billMethod, billType | Pocket balance processing, file import |
| BillUpload | `billUploadApi` | Full CRUD | billUploadType, handleType, billType/billMethod (dynamic), judgeWay | Dynamic search fields based on handleType |
| AmountSummary | `moneyApi` | Read only | Time range selectors | 3 charts (pie, list, column charts) |
| Schedule | `scheduleAPi` | Full CRUD | keywords | Date/time range fields |
| Home | `waitForDoApi` + userStore | CRUD for to-do items | Classification select + state tabs | Drag-and-drop reorder, inline add with deadline picker |
| Login | `userStore` | Login only | N/A | Captcha (disabled) |
| Setting Account | `userApi` | Update only | N/A | Avatar upload |
| Setting Password | `userApi` | Update password | N/A | Password confirmation validation |
| Workplace | `homeApi` (disabled) | None | N/A | Dashboard with stat cards, icon nav, VisitTab |
</task_result>
```

**Tool: task**

**Input:**
```json
{
  "description": "Explore shared API and types",
  "prompt": "Explore the shared API types and API service files used by admin-web. I need to understand:\n\n1. What API modules exist in packages/shared/ related to admin (capital module)\n2. Look at the API service files in packages/admin-web/src/api/ \n3. What are the shared type definitions in packages/shared/types/api/capital/ and packages/shared/types/api/blog/\n4. Check packages/shared/src/constants/ for relevant constants\n\nReturn a summary of all API endpoints and their corresponding type definitions that the admin pages use.",
  "subagent_type": "explore"
}
```

**Output:**
```
task_id: ses_1b4a425f4ffetCsZog78fisV8h (for resuming to continue this task if needed)

<task_result>
Here is a comprehensive summary of all API endpoints, their service functions, and corresponding shared type definitions used by admin-web.

---

## Architecture Overview

The admin-web uses **two Axios instances** (defined in `packages/admin-web/src/api/axios/index.ts`):

| Instance | Base URL Source | Used For |
|---|---|---|
| `AxiosCapital` | `APP_ENV_CONFIG.capitalApiUrl` | Auth, users, roles, menus, categories, images, configuration, to-do items |
| `AxiosBlog` | `APP_ENV_CONFIG.blogApiUrl` | Articles, schedules, money/bills (WeChat, AliPay, Bank, Bill Upload) |

All responses conform to `ApiResponse<T>` (`packages/shared/types/api/common.d.ts`):
```typescript
interface ApiResponse<T> { code: number; result?: T; message: string; }
```

---

## 1. CAPITAL MODULE -- Auth & Core

**Source files:**
- API: `packages/admin-web/src/api/capital/index.ts`
- Types: `packages/shared/types/api/capital.d.ts`

| Function | Method | Endpoint | Request Type | Response Type |
|---|---|---|---|---|
| `login` | POST | `/login` | `ApiCapitalLoginData` | `ApiResponse<ApiCapitalLoginResult>` |
| `signUp` | POST | `/sign_up` | `ApiCapitalSignUpData` | `ApiResponse<string>` |
| `adminMenus` | GET | `/role_route` | `roleCode: string` (query) | `ApiMenuItem[]` |
| `removeUser` | DELETE | `/remove_user/{userId}` | `userId: string` (path) | `undefined` |

**Types used:**
- `ApiCapitalLoginData` -- `{ username, password }`
- `ApiCapitalLoginResult` -- `{ token }`
- `ApiCapitalSignUpData` -- `{ nickname, avatar, username, roleCode, password }`

---

## 2. CAPITAL MODULE -- User Management

**Source files:**
- API: `packages/admin-web/src/api/capital/user.ts`
- Types: `packages/shared/types/api/capital/user.d.ts`

| Function | Method | Endpoint | Request Type | Response Type |
|---|---|---|---|---|
| `getUserInfo` | GET | `/user/admin_info` | -- | `ApiUserInfo` |
| `getPage` | POST | `/user/find_page` | `ApiUserPageData` | `TablePaginationResult<ApiUserItem[]>` |
| `updateRoleCode` | PUT | `/user/update_role_code` | `ApiUserUpdateRoleCodeData` | `undefined` |
| `updateUserInfo` | PUT | `/user/update_user_info` | `ApiUserUpdateUserInfoData` | `undefined` |
| `remove` | DELETE | `/user/{userId}` | `userId: string` (path) | `undefined` |
| `updateUserPassword` | PUT | `/user/update_user_password` | `UserUpdateUserPassword` | `undefined` |

**Types used:**
- `ApiUserPageData` = `ApiUserSearchParams & ApiPaginateParams` -- `{ nickname?, username?, size?, current? }`
- `ApiUserItem` = `ApiUser & ApiUserId` -- `{ nickname, avatar, username, password, loginDate, roleCode, userId }`
- `ApiUserInfo` = `Omit<ApiUser, 'password'> & ApiUserId & { roleName }` -- `{ nickname, avatar, username, loginDate, roleCode, userId, roleName }`
- `ApiUserUpdateRoleCodeData` -- `{ userId, roleCode }`
- `ApiUserUpdateUserInfoData` -- `{ nickname, username, avatar }`
- `UserUpdateUserPassword` -- `{ password, updatePassword }`
- `UserAvatarItem` -- `{ url, key, status: 'finished' }` (for form display)
- `UserUpdateUserInfoForm` -- `{ nickname, username, avatar: UserAvatarItem[] }` (form version)
- `UserItemForm` -- `{ nickname, avatar, username, roleCode, password, verifyPassword }` (admin create/edit form)

---

## 3. CAPITAL MODULE -- Role Management

**Source files:**
- API: `packages/admin-web/src/api/capital/role.ts`
- Types: `packages/shared/types/api/capital/role.d.ts`

| Function | Method | Endpoint | Request Type | Response Type |
|---|---|---|---|---|
| `getPage` | POST | `/role/role_page` | `ApiRolePageData` | `TablePaginationResult<ApiRoleItem[]>` |
| `getAll` | GET | `/role/all` | -- | `ApiRoleItem[]` |
| `save` | POST | `/role/save` | `ApiRoleSaveData` | `undefined` |
| `update` | PUT | `/role/update` | `ApiRoleUpdateData` | `undefined` |
| `remove` | DELETE | `/role/{roleId}` | `roleId: string` (path) | `undefined` |
| `getApiAll` | GET | `/role/api_all` | -- | `ApiSwaggerJsonAllAssociateResult[]` |

**Types used:**
- `ApiRolePageData` = `ApiPaginateParams & ApiRoleSearchParams` -- `{ name?, roleCode?, size?, current? }`
- `ApiRoleItem` = `ApiRole & ApiRoleId` -- `{ name, roleCode, roleType, menuPermission[], apiPermission[], roleId }`
- `ApiRoleSaveData` = `ApiRole` -- `{ name, roleCode, roleType, menuPermission[], apiPermission[] }`
- `ApiRoleUpdateData` = `ApiRoleSaveData & ApiRoleId` -- `{ name, roleCode, roleType, menuPermission[], apiPermission[], roleId }`
- `ApiSwaggerJsonAllAssociateResult` -- `{ tagId, tagName, children: ApiSwaggerJsonResult[] }` (hierarchical Swagger API listing for permission assignment)

---

## 4. CAPITAL MODULE -- Menu Management

**Source files:**
- API: `packages/admin-web/src/api/capital/menu.ts`
- Types: `packages/shared/types/api/capital/menu.d.ts`

| Function | Method | Endpoint | Request Type | Response Type |
|---|---|---|---|---|
| `getMenuList` | GET | `/menu/find_term` | -- | `ApiMenuItem[]` |
| `saveMenu` | POST | `/menu/save` | `ApiMenuSaveData` | `undefined` |
| `updateMenu` | PUT | `/menu/update` | `ApiMenuUpdateData` | `undefined` |
| `removeMenu` | DELETE | `/menu/{menuId}` | `menuId: string` (path) | `undefined` |

**Types used:**
- `ApiMenuSaveData` = `ApiMenu` -- `{ name, title, parentId, menuType, hidden, component?, sort, icon?, iframeSrc?, externalLink?, keepAlive?, menuConfigSystem?, detConfigSystem?, detName?, detComponent? }`
- `ApiMenuUpdateData` = `ApiMenuSaveData & ApiMenuId` -- adds `menuId`
- `ApiMenuItem` = `ApiMenu & ApiMenuId` -- full menu item with id
- `ApiLevelMenuItem` = `ApiMenuItem & { children?: ApiLevelMenuItem[], parentName? }` -- hierarchical tree structure

---

## 5. CAPITAL MODULE -- Category (Global Type) Management

**Source files:**
- API: `packages/admin-web/src/api/capital/category.ts`
- Types: `packages/shared/types/api/capital/category.d.ts`

| Function | Method | Endpoint | Request Type | Response Type |
|---|---|---|---|---|
| `certainTypeAll` | GET | `/category/certain_type_all` | `type: string` (query) | `ApiCategoryItem[]` |
| `getPage` | POST | `/category/find_page` | `ApiCategoryFindPageData` | `TablePaginationResult<ApiCategoryItem[]>` |
| `save` | POST | `/category/save` | `ApiCategorySaveData` | `undefined` |
| `update` | PUT | `/category/update` | `ApiCategoryUpdateData` | `undefined` |
| `remove` | DELETE | `/category/{categoryId}` | `categoryId: string` (path) | `undefined` |

**Types used:**
- `ApiCategoryFindPageData` = `ApiPaginateParams & ApiCategorySearchParams` -- `{ type?, size?, current? }`
- `ApiCategoryItem` = `ApiCategory & ApiCategoryId` -- `{ type, value?, valueStr?, label, categoryId }`
- `ApiCategorySaveData` = `ApiCategory` -- `{ type, value?, valueStr?, label }`
- `ApiCategoryUpdateData` = `ApiCategorySaveData & ApiCategoryId` -- adds `categoryId`

---

## 6. CAPITAL MODULE -- Image Management

**Source files:**
- API: `packages/admin-web/src/api/capital/image.ts`
- Types: `packages/shared/types/api/capital/image.d.ts`

| Function | Method | Endpoint | Request Type | Response Type |
|---|---|---|---|---|
| `getPage` | POST | `/image/find_page` | `ApiImagePageData` | `TablePaginationResult<ApiImageItem[]>` |
| `getOnlyPublic` | GET | `/image/only_public` | -- | `ReadImageItem[]` |
| `getOntUse` | GET | `/image/not_use` | -- | `ApiImageItem[]` |
| `removePublic` | DELETE | `/image/remove_public/{fileName}` | `fileName: string` (path) | `undefined` |
| `removePublicAll` | DELETE | `/image/remove_public_all` | `{ fileNameArr: string[] }` | `undefined` |
| `removeData` | DELETE | `/image/remove_data/{imageId}` | `imageId: string` (path) | `undefined` |
| `removePublicAndData` | DELETE | `/image/remove_public_data/{imageId}` | `imageId: string` (path) | `undefined` |
| `removePublicAndDataAll` | DELETE | `/image/remove_public_data_all` | `{ imageIdArr: string[] }` | `undefined` |

**Types used:**
- `ApiImagePageData` = `ApiPaginateParams & ApiImageSearchParams` -- `{ name?, source?, size?, current? }`
- `ApiImageItem` = `ApiImage & ApiImageId & { exists? }` -- `{ size, name, imageType, fileName, url, uploadTime, source, imageId, exists? }`
- `ReadImageItem` -- `{ name, imageType, fileName, url }` (from static directory)
- `UploadedImage` -- `{ filename, size }` (upload response)

---

## 7. CAPITAL MODULE -- Configuration (UI Settings)

**Source files:**
- API: `packages/admin-web/src/api/capital/configuration.ts`
- Types: `packages/shared/types/api/capital/configuration.d.ts`

| Function | Method | Endpoint | Request Type | Response Type |
|---|---|---|---|---|
| `getConfigInfo` | GET | `/configuration/info` | -- | `ApiConfiguration` |
| `update` | PUT | `/configuration/update` | `ApiConfigInfo` | `undefined` |

**Types used:**
- `ApiConfiguration` -- `{ userId, appTheme: 'light'|'dark', appThemeColor, navMode, siderIsDark, headIsDark, headFixed, tabsViewShow, tabsViewFixed, footerShow, footerFixed, headerReloadShow, headerBreadcrumbShow, headerBreadcrumbShowIcon, hasPageAnimate, pageAnimateType: ApiAnimate }`
- `ApiConfigInfo` = `Omit<ApiConfiguration, 'userId'>` -- same as above without userId
- `ApiConfNavMode` = `'vertical' | 'horizontal' | 'horizontal-mix'`
- `ApiAppTheme` = `'light' | 'dark'`
- `ApiAnimate` = `'zoom-fade' | 'zoom-out' | 'fade' | 'fade-slide' | 'fade-top' | 'fade-bottom' | 'fade-scale'`

---

## 8. CAPITAL MODULE -- Wait-For-Do (To-Do Items)

**Source files:**
- API: `packages/admin-web/src/api/capital/wait-for-do.ts`
- Types: `packages/shared/types/api/capital/wait-for-do.d.ts`

| Function | Method | Endpoint | Request Type | Response Type |
|---|---|---|---|---|
| `save` | POST | `/wait-for-do/save` | `ApiWaitForDoSaveData` | `undefined` |
| `classifyAll` | GET | `/wait-for-do/classify_all` | `classify, state` (query) | `ApiWaitForDoItem[]` |
| `updateState` | PUT | `/wait-for-do/update_state` | `ApiWaitForDoUpdateStateHasIdData` | `undefined` |
| `updateSort` | PUT | `/wait-for-do/update_sort` | `ApiWaitForDoUpdateSortData[]` | `undefined` |
| `update` | PUT | `/wait-for-do/update` | `ApiWaitForDoUpdateData` | `undefined` |
| `detail` | GET | `/wait-for-do/{waitForDoId}` | `waitForDoId: string` (path) | `ApiWaitForDoItem` |
| `remove` | DELETE | `/wait-for-do/{waitForDoId}` | `waitForDoId: string` (path) | `undefined` |

**Types used:**
- `ApiWaitForDoItem` = `ApiWaitForDo & ApiWaitForDoId` -- `{ title, classify, deadline?, remark, state, sort, isRemove, userId, completionTime?, waitForDoId }`
- `ApiWaitForDoSaveData` -- `{ title, classify, deadline, state }`
- `ApiWaitForDoUpdateStateData` -- `{ state, completionTime?, $unset? }`
- `ApiWaitForDoUpdateStateHasIdData` = `ApiWaitForDoId & ApiWaitForDoUpdateStateData` -- adds `waitForDoId`
- `ApiWaitForDoUpdateSortData` = `ApiWaitForDoId` -- `{ waitForDoId }`
- `ApiWaitForDoUpdateData` = `ApiWaitForDoId & { title?, deadline?, remark? }`

---

## 9. BLOG MODULE -- Article Management

**Source files:**
- API: `packages/admin-web/src/api/blog/article.ts`
- Types: `packages/shared/types/api/blog/article.d.ts`

| Function | Method | Endpoint | Request Type | Response Type |
|---|---|---|---|---|
| `getFindPage` | POST | `/article/find_all_page` | `ApiArticleFindPageData` | `TablePaginationResult<ApiArticleItem[]>` |
| `save` | POST | `/article/save` | `ApiArticleSaveData` | `undefined` |
| `update` | PUT | `/article/update` | `ApiArticleUpdateData` | `undefined` |
| `batchUpdatePrivate` | PUT | `/article/batch_update_private` | `ApiBatchUpdatePrivateArticleData` | `undefined` |
| `remove` | DELETE | `/article/{articleId}` | `articleId: string` (path) | `undefined` |
| `exportArticle` | GET | `/article/export_article/{articleId}` | `articleId: string` (path) | Blob download |

**Types used:**
- `ApiArticleFindPageData` = `ApiPaginateParams & ApiArticleSearchParams` -- `{ keywords?, categoryVal?, isPrivate?, size?, current? }`
- `ApiArticleItem` = `ApiArticle & ApiArticleId` -- `{ title, brief, categoryVal, htmlContent, markdownContent, cssContent, isPrivate, authorId, authorNickname, createTime, articleId }`
- `ApiArticleSaveData` -- `{ title, brief, categoryVal, htmlContent, markdownContent, cssContent, isPrivate }`
- `ApiArticleUpdateData` = `ApiArticleSaveData & ApiArticleId` -- adds `articleId`
- `ApiBatchUpdatePrivateArticleData` -- `{ articleIdArr: string[], isPrivate: boolean }`

---

## 10. BLOG MODULE -- Schedule Management

**Source files:**
- API: `packages/admin-web/src/api/blog/schedule.ts`
- Types: `packages/shared/types/api/blog/schedule.d.ts`

| Function | Method | Endpoint | Request Type | Response Type |
|---|---|---|---|---|
| `getFindPage` | POST | `/schedule/find_page` | `ApiScheduleFindPageData` | `TablePaginationResult<ApiScheduleItem[]>` |
| `save` | POST | `/schedule/save` | `ApiScheduleSaveData` | `undefined` |
| `update` | PUT | `/schedule/update` | `ApiScheduleUpdateData` | `undefined` |
| `remove` | DELETE | `/schedule/{id}` | `id: string` (path) | `undefined` |
| `daily` | GET | `/schedule/daily` | `ApiStartEndTimeParams` (query) | `ScheduleDailyItem[]` |

**Types used:**
- `ApiScheduleFindPageData` = `ApiPaginateParams & ApiScheduleSearchParams` -- `{ keywords?, size?, current? }`
- `ApiScheduleItem` = `ApiSchedule & ApiScheduleId & { nickName }` -- `{ title, content, startDate, endDate, startTime, endTime, createTime, userId, scheduleId, nickName }`
- `ApiScheduleSaveData` -- `{ title, content, startDate, endDate, startTime, endTime }`
- `ApiScheduleUpdateData` = `ApiScheduleSaveData & ApiScheduleId` -- adds `scheduleId`
- `ApiStartEndTimeParams` -- `{ startTime, endTime }` (from `common.d.ts`)

---

## 11. BLOG MODULE -- Money Statistics (Overview)

**Source files:**
- API: `packages/admin-web/src/api/blog/money/index.ts`
- Types: `packages/shared/types/api/blog/money/index.d.ts`

| Function | Method | Endpoint | Request Type | Response Type |
|---|---|---|---|---|
| `statisticsMoneyBalance` | GET | `/money/statistics_money_balance` | -- | `ApiMoneyBalanceResult[]` |
| `getStatisticsBankFlow` | GET | `/money/statistics_bank_flow` | `ApiStartEndTimeParams` (query) | `ApiBankFlowResult[]` |
| `statisticsInflowOrOutflowMoney` | GET | `/money/statistics_inflow_or_outflow_money` | `ApiStartEndTimeParams` (query) | `ApiInflowOrOutflowMoneyResult` |

**Types used:**
- `ApiMoneyBalanceResult` -- `{ name, value }` (balance per payment method)
- `ApiBankFlowResult` = `ApiBankFlow & { name }` -- `{ name, voucherNum?, startBalance, endBalance, inflowMoneyAmount, outflowMoneyAmount, voucherNo?, voucherType?, children? }`
- `ApiInflowOrOutflowMoneyResult` -- `{ outflowSumTotal, outflowChart: ApiFlowChart[], inflowSumTotal, inflowChart: ApiFlowChart[] }`
- `ApiFlowChart` -- `{ name, money }`
- `MoneyBalanceType` = union of `'weChatBalance' | 'aliPayBalance' | 'aliPayBalanceBaby' | 'businessBank' | 'agricultureBank' | 'buildBank' | 'civilBank' | 'attractInvestmentBank'`

---

## 12. BLOG MODULE -- WeChat Bills

**Source files:**
- API: `packages/admin-web/src/api/blog/money/we-chat.ts`
- Types: `packages/shared/types/api/blog/money/we-chat.d.ts`

| Function | Method | Endpoint | Request Type | Response Type |
|---|---|---|---|---|
| `getPage` | POST | `/money/we-chat/find_page` | `ApiWeChatFindPageData` | `TablePaginationResult<ApiWeChatItem[]>` |
| `batchSave` | POST | `/money/we-chat/batch-save` | `ApiWeChatBatchSaveData` | `undefined` |
| `update` | PUT | `/money/we-chat/update` | `ApiWeChatUpdateData` | `undefined` |
| `updateBalance` | PUT | `/money/we-chat/update_balance` | `ApiStartEndTimeParams` (query) | `undefined` |

**Types used:**
- `ApiWeChatFindPageData` = `ApiPaginateParams & ApiWeChatSearchParams` -- `{ tradeOtherPerson?, inflowOrOutflow?, billType?, billMethod?, size?, current? }`
- `ApiWeChatItem` = `ApiWeChatBase & ApiWeChatCreate & ApiWeChatId` -- full item with `weChatId`
- `ApiWeChatBase` -- `{ tradeTime, tradeType, tradeOtherPerson, tradeOtherPersonRemarks, goods, incomeOrPay, moneyAmount, otherCost, paymentMethod, currentStatus, remarks, explain, place }`
- `ApiWeChatCreate` -- `{ userId, inflowOrOutflow, billType, billMethod, balance }`
- `ApiWeChatBatchSaveData` -- `{ batches: ApiWeChatBatchSaveItem[] }`
- `ApiWeChatUpdateData` = `ApiWeChatId & { tradeOtherPersonRemarks?, inflowOrOutflow, explain?, place?, billMethod, billType }`
- `ApiWeChatUpload` -- import data structure (13 fields)

---

## 13. BLOG MODULE -- AliPay Bills

**Source files:**
- API: `packages/admin-web/src/api/blog/money/ali-pay.ts`
- Types: `packages/shared/types/api/blog/money/ali-pay.d.ts`

| Function | Method | Endpoint | Request Type | Response Type |
|---|---|---|---|---|
| `getPage` | POST | `/money/ali-pay/find_page` | `ApiAliPayFindPageData` | `TablePaginationResult<ApiAliPayItem[]>` |
| `batchSave` | POST | `/money/ali-pay/batch-save` | `ApiAliPayBatchSaveData` | `undefined` |
| `update` | PUT | `/money/ali-pay/update` | `ApiAliPayUpdateData` | `undefined` |
| `updateBalance` | PUT | `/money/ali-pay/update_balance` | `ApiStartEndTimeParams` (query) | `undefined` |
| `updateBalanceBaby` | PUT | `/money/ali-pay/update_balance_baby` | `ApiStartEndTimeParams` (query) | `undefined` |

**Types used:**
- `ApiAliPayFindPageData` = `ApiPaginateParams & ApiAliPaySearchParams` -- `{ tradeOtherPerson?, inflowOrOutflow?, billType?, billMethod?, size?, current? }`
- `ApiAliPayItem` = `ApiAliPayBase & ApiAliPayCreate & ApiAliPayId` -- full item with `aliPayId`
- `ApiAliPayBase` -- `{ tradeTime, tradeType, tradeOtherPerson, tradeOtherPersonRemarks, productDescription, incomeOrPay, moneyAmount, otherCost, paymentMethod, oppositeAccount, explain, place }`
- `ApiAliPayCreate` -- `{ userId, inflowOrOutflow, billType, billMethod, balance, balanceBaby }`
- `ApiAliPayBatchSaveData` -- `{ batches: ApiAliPayBatchSaveItem[] }`
- `ApiAliPayUpdateData` = `ApiAliPayId & { tradeOtherPersonRemarks?, inflowOrOutflow, explain?, place?, billMethod, billType }`
- `ApiAliPayUpload` -- import data structure (13 fields)

---

## 14. BLOG MODULE -- Bank Bills

**Source files:**
- API: `packages/admin-web/src/api/blog/money/bank.ts`
- Types: `packages/shared/types/api/blog/money/bank.d.ts`

| Function | Method | Endpoint | Request Type | Response Type |
|---|---|---|---|---|
| `getPage` | POST | `/money/bank/find_page` | `ApiBankFindPageData` | `TablePaginationResult<ApiBankItem[]>` |
| `batchSave` | POST | `/money/bank/batch-save` | `ApiBankBatchSaveData` | `undefined` |
| `update` | PUT | `/money/bank/update` | `ApiBankUpdateData` | `undefined` |
| `remove` | DELETE | `/money/bank/remove/{bankId}` | `bankId: string` (path) | `undefined` |

**Types used:**
- `ApiBankFindPageData` = `ApiPaginateParams & ApiBankSearchParams` -- `{ tradeOtherPerson?, inflowOrOutflow?, bankType?, bankBillType?, size?, current? }`
- `ApiBankItem` = `ApiBankBase & ApiBankCreate & ApiBankId` -- full item with `bankId`
- `ApiBankBase` -- `{ tradeTime, tradeType, bankType, voucherType, voucherNo, tradeOtherPerson, tradeOtherPersonAccount, tradeOtherPersonRemarks, incomeOrPay, moneyAmount, balance, otherCost, explain, place }`
- `ApiBankCreate` -- `{ userId, inflowOrOutflow, bankBillType }`
- `ApiBankBatchSaveData` -- `{ batches: ApiBankBatchSaveItem[] }`
- `ApiBankUpdateData` = `ApiBankId & { otherCost, tradeOtherPersonRemarks, inflowOrOutflow, explain, place, bankBillType }`
- `ApiBankUpload` -- import data structure (15 fields)

---

## 15. BLOG MODULE -- Bill Upload Rules

**Source files:**
- API: `packages/admin-web/src/api/blog/money/bill-upload.ts`
- Types: `packages/shared/types/api/blog/bill-upload.d.ts`

| Function | Method | Endpoint | Request Type | Response Type |
|---|---|---|---|---|
| `getPage` | POST | `/money/bill-upload/find_page` | `ApiBillUploadFindPageData` | `TablePaginationResult<ApiBillUploadItem[]>` |
| `save` | POST | `/money/bill-upload/save` | `ApiBillUploadSaveData` | `undefined` |
| `update` | PUT | `/money/bill-upload/update` | `ApiBillUploadUpdateData` | `undefined` |
| `remove` | DELETE | `/money/bill-upload/{billUploadId}` | `billUploadId: string` (path) | `undefined` |

**Types used:**
- `ApiBillUploadFindPageData` = `ApiPaginateParams & ApiBillUploadSearchParams` -- `{ billUploadType?, handleType?, judgeWay?, size?, current? }`
- `ApiBillUploadItem` = `ApiBillUpload & ApiBillUploadId` -- `{ billUploadType, billJudgeKey, handleType, inflowOrOutflow?, billType?, billMethod?, priorityWeight, judgeWay, judgeVal: string[], billUploadId }`
- `ApiBillUploadSaveData` = `ApiBillUpload`
- `ApiBillUploadUpdateData` = `ApiBillUploadSaveData & ApiBillUploadId`

---

## 16. Shared Common Types

**Source:** `packages/shared/types/api/common.d.ts`

| Type | Fields | Usage |
|---|---|---|
| `ApiResponse<T>` | `{ code, result?, message }` | Standard response wrapper |
| `ApiPaginateParams` | `{ size?, current? }` | Pagination for all `find_page` endpoints |
| `ApiStartEndTimeParams` | `{ startTime, endTime }` | Date range queries (schedules, bank flow, balance updates) |

---

## 17. Relevant Shared Constants

**Source:** `packages/shared/src/constants/`

### `api-type.ts` -- Business Enum Constants

| Constant | Values | Used By |
|---|---|---|
| `menuTypeOption` | `1=目录, 5=菜单, 6=内嵌, 7=外链` | Menu management |
| `roleTypeOption` | `1=全部权限, 2=自定义权限` | Role management |
| `inflowOrOutflowOption` | `1=流入, 2=流出` | All money/bill modules |
| `voucherTypeOption` | `1=存折, 2=储蓄卡, 3=信用卡` | Bank bills |
| `categoryTypeEnum` | Maps logical names to type strings: `money_bill_type`, `money_bank_type`, `money_bill_method`, `capital_image_source`, `capital_wait-for-do_classify`, `blog_article_category` | Category queries |
| `billUploadTypeOption` | `1=微信账单, 2=支付宝账单, 3=银行账单` | Bill upload rules |
| `handleTypeOption` | `inflowOrOutflow, billType, billMethod` | Bill upload rules |
| `weChatBillJudgeOptions` | 7 judge keys (tradeType, tradeOtherPerson, goods, etc.) | WeChat bill upload |
| `aliPayBillJudgeOptions` | 7 judge keys (tradeType, tradeOtherPerson, oppositeAccount, etc.) | AliPay bill upload |
| `bankBillJudgeOptions` | 6 judge keys (explain, incomeOrPay, tradeOtherPerson, etc.) | Bank bill upload |
| `judgeWayOption` | `indexOf, includes` | Bill upload rule matching method |

### `http-enum.ts` -- HTTP Protocol Constants

| Constant | Values |
|---|---|
| `ResultEnum.SUCCESS` | `0` |
| `ResultEnum.ERROR` | `-1` |
| `ResultEnum.TIMEOUT` | `10042` |

### `storage-name.ts` -- LocalStorage Keys

| Constant | Value |
|---|---|
| `ACCESS_TOKEN` | `'ACCESS-TOKEN'` |
| `CURRENT_USER` | `'CURRENT-USER'` |
| `USER_CONFIG` | `'USER-CONFIG'` |
| `IS_LOCK_SCREEN` | `'IS-LOCK-SCREEN'` |

### `table-const.ts` -- Pagination Constants

| Constant | Value |
|---|---|
| `DEFAULT_PAGESIZE` | `10` |
| `PAGE_FIELD` | `'current'` |
| `SIZE_FIELD` | `'size'` |
| `PAGE_SIZES` | `[10, 20, 50, 100, 200]` |

---

## API Export Map

From `packages/admin-web/src/api/index.ts`, all API modules are re-exported as namespaces:

```
capitalApi        -> ./capital/index     (login, signUp, adminMenus, removeUser)
menuApi           -> ./capital/menu      (getMenuList, saveMenu, updateMenu, removeMenu)
userApi           -> ./capital/user      (getUserInfo, getPage, updateRoleCode, updateUserInfo, remove, updateUserPassword)
roleApi           -> ./capital/role      (getPage, getAll, save, update, remove, getApiAll)
configurationApi  -> ./capital/configuration (getConfigInfo, update)
categoryApi       -> ./capital/category  (certainTypeAll, getPage, save, update, remove)
imageApi          -> ./capital/image     (getPage, getOnlyPublic, getOntUse, removePublic, removePublicAll, removeData, removePublicAndData, removePublicAndDataAll)
waitForDoApi      -> ./capital/wait-for-do (save, classifyAll, updateState, updateSort, update, detail, remove)
articleAPi        -> ./blog/article      (getFindPage, save, update, batchUpdatePrivate, remove, exportArticle)
scheduleAPi       -> ./blog/schedule     (getFindPage, save, update, remove, daily)
moneyApi          -> ./blog/money/index  (statisticsMoneyBalance, getStatisticsBankFlow, statisticsInflowOrOutflowMoney)
weChatApi         -> ./blog/money/we-chat (getPage, batchSave, update, updateBalance)
aliPayApi         -> ./blog/money/ali-pay (getPage, batchSave, update, updateBalance, updateBalanceBaby)
bankApi           -> ./blog/money/bank   (getPage, batchSave, update, remove)
billUploadApi     -> ./blog/money/bill-upload (getPage, save, update, remove)
```

**Total: 16 API modules, 55 endpoint functions, spanning 2 backend service prefixes (`/capital-api` and `/blog-api` via proxy).**
</task_result>
```

---

## Assistant (Plan · GLM-5.1 · 4.3s)

现在让我检查一下现有的移动项目结构和任何现有的配置：

**Tool: read**

**Input:**
```json
{
  "filePath": "E:\\program\\Front\\blog\\blog-monorepo\\packages\\admin-mobile\\pages.json"
}
```

**Output:**
```
<path>E:\program\Front\blog\blog-monorepo\packages\admin-mobile\pages.json</path>
<type>file</type>
<content>
1: {
2: 	"pages": [ //pages数组中第一项表示应用启动页，参考：https://uniapp.dcloud.io/collocation/pages
3: 		{
4: 			"path": "pages/index/index",
5: 			"style": {
6: 				"navigationBarTitleText": "uni-app"
7: 			}
8: 		}
9: 	],
10: 	"globalStyle": {
11: 		"navigationBarTextStyle": "black",
12: 		"navigationBarTitleText": "uni-app",
13: 		"navigationBarBackgroundColor": "#F8F8F8",
14: 		"backgroundColor": "#F8F8F8"
15: 	},
16: 	"uniIdRouter": {}
17: }

(End of file - total 17 lines)
</content>

<system-reminder>
Instructions from: E:\program\Front\blog\blog-monorepo\packages\admin-mobile\AGENTS.md
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
| `@/*` | `src/*` | 项目源码（尚未创建 src/） |
| `/#/*` | `packages/shared/types/*` | 解析到 `shared/types/`，对类型就只有这个 |
| `@shared/*` | `packages/shared/src/*` | 共享源码（utils, constants） |

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

</system-reminder>
```

**Tool: read**

**Input:**
```json
{
  "filePath": "E:\\program\\Front\\blog\\blog-monorepo\\packages\\admin-mobile\\App.vue"
}
```

**Output:**
```
<path>E:\program\Front\blog\blog-monorepo\packages\admin-mobile\App.vue</path>
<type>file</type>
<content>
1: <script lang="ts">
2: import { defineComponent } from 'vue'
3: export default defineComponent({
4: 	onLaunch: function () {
5: 		console.log('App Launch')
6: 	},
7: 	onShow: function () {
8: 		console.log('App Show')
9: 	},
10: 	onHide: function () {
11: 		console.log('App Hide')
12: 	}
13: })
14: </script>
15: 
16: <style>
17: /*每个页面公共css */
18: </style>

(End of file - total 18 lines)
</content>
```

**Tool: read**

**Input:**
```json
{
  "filePath": "E:\\program\\Front\\blog\\blog-monorepo\\packages\\admin-mobile\\main.ts"
}
```

**Output:**
```
<path>E:\program\Front\blog\blog-monorepo\packages\admin-mobile\main.ts</path>
<type>file</type>
<content>
1: import App from './App.vue';
2: import { createSSRApp } from 'vue';
3: 
4: export function createApp() {
5:   const app = createSSRApp(App);
6:   return {
7:     app,
8:   };
9: }

(End of file - total 9 lines)
</content>
```

**Tool: read**

**Input:**
```json
{
  "filePath": "E:\\program\\Front\\blog\\blog-monorepo\\packages\\admin-mobile\\uni.scss"
}
```

**Output:**
```
<path>E:\program\Front\blog\blog-monorepo\packages\admin-mobile\uni.scss</path>
<type>file</type>
<content>
1: /**
2:  * 这里是uni-app内置的常用样式变量
3:  *
4:  * uni-app 官方扩展插件及插件市场（https://ext.dcloud.net.cn）上很多三方插件均使用了这些样式变量
5:  * 如果你是插件开发者，建议你使用scss预处理，并在插件代码中直接使用这些变量（无需 import 这个文件），方便用户通过搭积木的方式开发整体风格一致的App
6:  *
7:  */
8: 
9: /**
10:  * 如果你是App开发者（插件使用者），你可以通过修改这些变量来定制自己的插件主题，实现自定义主题功能
11:  *
12:  * 如果你的项目同样使用了scss预处理，你也可以直接在你的 scss 代码中使用如下变量，同时无需 import 这个文件
13:  */
14: 
15: /* 颜色变量 */
16: 
17: /* 行为相关颜色 */
18: $uni-color-primary: #007aff;
19: $uni-color-success: #4cd964;
20: $uni-color-warning: #f0ad4e;
21: $uni-color-error: #dd524d;
22: 
23: /* 文字基本颜色 */
24: $uni-text-color:#333;//基本色
25: $uni-text-color-inverse:#fff;//反色
26: $uni-text-color-grey:#999;//辅助灰色，如加载更多的提示信息
27: $uni-text-color-placeholder: #808080;
28: $uni-text-color-disable:#c0c0c0;
29: 
30: /* 背景颜色 */
31: $uni-bg-color:#ffffff;
32: $uni-bg-color-grey:#f8f8f8;
33: $uni-bg-color-hover:#f1f1f1;//点击状态颜色
34: $uni-bg-color-mask:rgba(0, 0, 0, 0.4);//遮罩颜色
35: 
36: /* 边框颜色 */
37: $uni-border-color:#c8c7cc;
38: 
39: /* 尺寸变量 */
40: 
41: /* 文字尺寸 */
42: $uni-font-size-sm:12px;
43: $uni-font-size-base:14px;
44: $uni-font-size-lg:16px;
45: 
46: /* 图片尺寸 */
47: $uni-img-size-sm:20px;
48: $uni-img-size-base:26px;
49: $uni-img-size-lg:40px;
50: 
51: /* Border Radius */
52: $uni-border-radius-sm: 2px;
53: $uni-border-radius-base: 3px;
54: $uni-border-radius-lg: 6px;
55: $uni-border-radius-circle: 50%;
56: 
57: /* 水平间距 */
58: $uni-spacing-row-sm: 5px;
59: $uni-spacing-row-base: 10px;
60: $uni-spacing-row-lg: 15px;
61: 
62: /* 垂直间距 */
63: $uni-spacing-col-sm: 4px;
64: $uni-spacing-col-base: 8px;
65: $uni-spacing-col-lg: 12px;
66: 
67: /* 透明度 */
68: $uni-opacity-disabled: 0.3; // 组件禁用态的透明度
69: 
70: /* 文章场景相关 */
71: $uni-color-title: #2C405A; // 文章标题颜色
72: $uni-font-size-title:20px;
73: $uni-color-subtitle: #555555; // 二级标题颜色
74: $uni-font-size-subtitle:26px;
75: $uni-color-paragraph: #3F536E; // 文章段落颜色
76: $uni-font-size-paragraph:15px;

(End of file - total 76 lines)
</content>
```

---

## Assistant (Plan · GLM-5.1 · 88.6s)

现在我有了全面的了解。让我来制定计划。

---

## 页面映射计划：admin-web → admin-mobile

### 概述

将 `admin-web` 的所有核心业务页面映射到 `admin-mobile` (uni-app + uView Pro)，进行移动端 UI 适配。

---

### 1. 页面目录结构

```
packages/admin-mobile/
├── pages/
│   ├── login/login.vue                    # 登录
│   ├── home/home.vue                      # 首页 (TabBar)
│   ├── dashboard/workplace.vue            # 仪表盘
│   ├── blog/
│   │   ├── article/article.vue            # 文章列表
│   │   ├── article-edit/article-edit.vue  # 文章新增/编辑 (替代 Modal)
│   │   ├── schedule/schedule.vue          # 日程列表
│   │   └── schedule-edit/schedule-edit.vue # 日程新增/编辑
│   ├── money/
│   │   ├── bank/bank.vue                  # 银行账单
│   │   ├── ali-pay/ali-pay.vue            # 支付宝账单
│   │   ├── we-chat/we-chat.vue            # 微信账单
│   │   ├── bill-upload/bill-upload.vue    # 账单上传规则
│   │   ├── amount-summary/amount-summary.vue # 财务汇总
│   │   ├── bank-edit/bank-edit.vue        # 银行账单编辑
│   │   ├── ali-pay-edit/ali-pay-edit.vue  # 支付宝编辑
│   │   ├── we-chat-edit/we-chat-edit.vue  # 微信编辑
│   │   └── bill-upload-edit/bill-upload-edit.vue # 上传规则编辑
│   ├── file/
│   │   └── image/image.vue               # 图片管理
│   ├── system/
│   │   ├── user/user.vue                  # 用户管理
│   │   ├── role/role.vue                  # 角色管理
│   │   ├── menu/menu.vue                  # 菜单管理
│   │   ├── category/category.vue          # 分类管理
│   │   ├── user-edit/user-edit.vue        # 用户新增/编辑
│   │   ├── role-edit/role-edit.vue        # 角色新增/编辑
│   │   ├── menu-edit/menu-edit.vue        # 菜单新增/编辑
│   │   └── category-edit/category-edit.vue # 分类新增/编辑
│   ├── setting/
│   │   ├── account/account.vue            # 账号设置
│   │   └── password/password.vue          # 密码修改
│   └── mine/mine.vue                      # 我的 (TabBar)
├── components/
│   ├── list-page/list-page.vue            # 通用列表页封装 (搜索+列表+分页+加载更多)
│   └── money-time-select/money-time-select.vue # 财务时间选择
├── api/                                    # API 层 (复用 admin-web 的 API 模块)
├── store/                                  # Pinia store
└── utils/                                  # 工具函数
```

### 2. TabBar 配置 (3个Tab)

| Tab | 图标 | 页面 |
|-----|------|------|
| 首页 | home | pages/home/home |
| 博客 | file-text | pages/blog/article/article |
| 我的 | account | pages/mine/mine |

### 3. 核心适配策略

| admin-web 模式 | admin-mobile 适配 |
|---|---|
| `NDataTable` 分页表格 | `u-cell-group` + `u-cell-item` 列表 + `u-loadmore` 上拉加载 + `u-pagination` |
| `NModal` 弹窗表单 | **新页面导航** (`uni.navigateTo`)，编辑完成 `uni.navigateBack` |
| `FormSearch` 搜索表单 | `u-search` 简单搜索 + `u-dropdown` 筛选器 |
| `NForm` 表单 | `u-form` + `u-form-item` + `u-input`/`u-select`/`u-picker` 等 |
| `NButton` 操作按钮 | `u-button` + `u-swipe-action` 左滑操作 (删除/编辑) |
| `NCard` 卡片 | `u-card` 或自定义卡片 |
| `NTag` 标签 | `u-tag` |
| `NImage` 图片 | `u-image` |
| `NDatePicker` 日期 | `u-calendar` / `u-picker mode="time"` |
| `NSelect` 下拉 | `u-select` / `u-picker mode="selector"` |
| `NUpload` 上传 | `u-upload` |
| Hooks 分层 | **保留** Configure hooks + Edit hooks 模式 |
| Markdown 编辑器 | 移动端暂不实现，文章编辑页仅表单+预览 |
| ECharts 图表 | 移动端暂用 `u-cell-item` 列表替代，或引入 `ucharts` |
| 拖拽排序 | 移动端暂不支持 |

### 4. 每个页面详细设计

#### 4.1 登录页 (`pages/login/login.vue`)
- `u-form` + `u-form-item` + `u-input` (username/password)
- `u-button type="primary"` 登录
- 无导航栏，全屏展示
- API: `userStore.login()`

#### 4.2 首页 (`pages/home/home.vue`) - TabBar
- 顶部：用户信息卡片 (`u-avatar` + 昵称 + 角色 + 登录时间)
- 中部：待办事项分类 `u-tabs` 切换
- 下方：待办列表 `u-cell-group`，支持勾选状态切换
- 底部：快速添加待办 `u-input` + `u-button`
- API: `waitForDoApi.classifyAll()`, `userStore.getInfo()`

#### 4.3 仪表盘 (`pages/dashboard/workplace.vue`)
- 从首页或"我的"入口进入
- 4个统计卡片 `u-grid` (访问/销售/订单/交易)
- API: `homeApi.getConsoleInfo()` (当前注释状态)

#### 4.4 文章列表 (`pages/blog/article/article.vue`) - TabBar
- `u-search` 关键词搜索
- `u-dropdown` 筛选: 分类 + 加密状态
- 文章卡片列表，每项显示: 标题、简介、分类标签、时间、加密标记
- `u-loadmore` 上拉加载
- 右下角 `u-fab` 浮动按钮 → 新建文章
- `u-swipe-action` 左滑: 编辑/删除/导出
- API: `articleAPi.getFindPage()`

#### 4.5 文章编辑 (`pages/blog/article-edit/article-edit.vue`)
- `u-form`: title(`u-input`), brief(`u-textarea`), category(`u-select`), isPrivate(`u-switch`)
- markdownContent: `u-textarea` (移动端简化，不做Markdown实时预览)
- 底部: 保存按钮 + 加密保存按钮
- API: `articleAPi.save()` / `articleAPi.update()`

#### 4.6 日程列表 (`pages/blog/schedule/schedule.vue`)
- `u-search` 关键词搜索
- 日程卡片: 标题、内容、起止日期时间
- `u-fab` → 新建
- `u-swipe-action` 左滑: 编辑/删除
- API: `scheduleAPi.getFindPage()`

#### 4.7 日程编辑 (`pages/blog/schedule-edit/schedule-edit.vue`)
- `u-form`: title, content(`u-textarea`), startDate/endDate(`u-calendar`), startTime/endTime(`u-picker mode="time"`)
- API: `scheduleAPi.save()` / `update()`

#### 4.8 银行账单 (`pages/money/bank/bank.vue`)
- `u-dropdown` 筛选: 时间、收支类型、银行类型、账单类型
- 账单列表 `u-cell-item`: 交易对方、金额(流入绿色/流出红色)、余额、时间
- API: `bankApi.getPage()`

#### 4.9 支付宝账单 (`pages/money/ali-pay/ali-pay.vue`)
- 类似银行账单结构
- 额外: 余额处理、余额宝处理按钮
- API: `aliPayApi.getPage()`, `aliPayApi.updateBalance()`, `aliPayApi.updateBalanceBaby()`

#### 4.10 微信账单 (`pages/money/we-chat/we-chat.vue`)
- 类似支付宝账单结构
- 额外: 零钱平衡处理
- API: `weChatApi.getPage()`, `weChatApi.updateBalance()`

#### 4.11 账单上传规则 (`pages/money/bill-upload/bill-upload.vue`)
- `u-dropdown` 筛选
- 规则列表 `u-cell-item`
- API: `billUploadApi.getPage()`

#### 4.12 财务汇总 (`pages/money/amount-summary/amount-summary.vue`)
- 余额概览 `u-cell-group` (各支付方式余额列表)
- 银行流水列表
- 收支统计列表 (简化版，暂无图表)
- `money-time-select` 时间范围选择
- API: `moneyApi.statisticsMoneyBalance()`, `moneyApi.getStatisticsBankFlow()`, `moneyApi.statisticsInflowOrOutflowMoney()`

#### 4.13 图片管理 (`pages/file/image/image.vue`)
- `u-search` + `u-dropdown` 按来源筛选
- 图片网格 `u-grid` (3列)，每格 `u-image`
- `u-swipe-action` 左滑删除
- API: `imageApi.getPage()`

#### 4.14 用户管理 (`pages/system/user/user.vue`)
- `u-search` 搜索昵称/用户名
- 用户列表 `u-cell-item` (头像+昵称+用户名+角色)
- `u-swipe-action` 左滑: 编辑/删除
- API: `userApi.getPage()`

#### 4.15 角色管理 (`pages/system/role/role.vue`)
- `u-search` 搜索
- 角色列表 `u-cell-item`
- API: `roleApi.getPage()`

#### 4.16 菜单管理 (`pages/system/menu/menu.vue`)
- `u-search` 搜索
- `u-collapse` 折叠面板展示树形菜单
- API: `menuApi.getMenuList()`

#### 4.17 分类管理 (`pages/system/category/category.vue`)
- `u-dropdown` 按类型筛选
- 分类列表 `u-cell-item`
- API: `categoryApi.getPage()`

#### 4.18 各编辑页面 (user-edit, role-edit, menu-edit, category-edit, bank-edit, ali-pay-edit, we-chat-edit, bill-upload-edit)
- 统一模式: `u-form` + `u-form-item` + 对应输入组件
- 底部固定提交按钮
- 新增时 `onLoad` 无参数，编辑时传入 id 从 API 加载数据

#### 4.19 账号设置 (`pages/setting/account/account.vue`)
- `u-form`: nickname, username, avatar(`u-upload`)
- API: `userApi.updateUserInfo()`

#### 4.20 密码修改 (`pages/setting/password/password.vue`)
- `u-form`: password, updatePassword, confirmPassword
- API: `userApi.updateUserPassword()`

#### 4.21 我的 (`pages/mine/mine.vue`) - TabBar
- 用户头像+昵称+角色
- `u-cell-group` 菜单入口: 账号设置、密码修改、仪表盘、图片管理
- `u-cell-group` 系统管理: 用户、角色、菜单、分类
- `u-cell-group` 财务管理: 银行/支付宝/微信账单、上传规则、财务汇总
- 底部: 退出登录按钮

### 5. 需要创建的基础设施

| 项目 | 说明 |
|------|------|
| `api/` 目录 | 复用 admin-web 的 API 模块结构，适配 uni.request 或使用 `@shared/utils/axios` |
| `store/` 目录 | Pinia stores (user, route 等) |
| `utils/request.ts` | uni-app 请求封装 (基于 `uni.request`，加入 token、baseURL、错误处理) |
| `utils/auth.ts` | Token 存储 (基于 `uni.setStorageSync` / `uni.getStorageSync`) |
| `components/list-page/` | 通用列表页组件 (搜索 + 列表 + 分页) |
| `components/money-time-select/` | 财务时间范围选择组件 |

### 6. 实施优先级

**第一阶段 - 基础设施** (必须先完成):
1. `utils/request.ts` 请求封装
2. `utils/auth.ts` 认证工具
3. `api/` 所有 API 模块
4. `store/` Pinia stores
5. `components/list-page/` 通用列表组件

**第二阶段 - 核心页面**:
6. 登录页
7. 首页 (含待办)
8. 我的页面
9. TabBar 配置 + pages.json

**第三阶段 - 业务页面**:
10. 文章列表 + 编辑
11. 日程列表 + 编辑
12. 用户/角色/菜单/分类 列表 + 编辑
13. 图片管理

**第四阶段 - 财务模块**:
14. 银行/支付宝/微信账单 + 编辑
15. 账单上传规则 + 编辑
16. 财务汇总

### 7. pages.json 最终结构预览

```json
{
  "pages": [
    { "path": "pages/home/home", "style": { "navigationBarTitleText": "首页" } },
    { "path": "pages/login/login", "style": { "navigationBarTitleText": "登录", "navigationStyle": "custom" } },
    { "path": "pages/mine/mine", "style": { "navigationBarTitleText": "我的" } },
    { "path": "pages/blog/article/article", "style": { "navigationBarTitleText": "文章管理" } },
    { "path": "pages/blog/article-edit/article-edit", "style": { "navigationBarTitleText": "文章编辑" } },
    { "path": "pages/blog/schedule/schedule", "style": { "navigationBarTitleText": "日程管理" } },
    { "path": "pages/blog/schedule-edit/schedule-edit", "style": { "navigationBarTitleText": "日程编辑" } },
    { "path": "pages/money/bank/bank", "style": { "navigationBarTitleText": "银行账单" } },
    { "path": "pages/money/ali-pay/ali-pay", "style": { "navigationBarTitleText": "支付宝账单" } },
    { "path": "pages/money/we-chat/we-chat", "style": { "navigationBarTitleText": "微信账单" } },
    { "path": "pages/money/bill-upload/bill-upload", "style": { "navigationBarTitleText": "上传规则" } },
    { "path": "pages/money/amount-summary/amount-summary", "style": { "navigationBarTitleText": "财务汇总" } },
    { "path": "pages/money/bank-edit/bank-edit", "style": { "navigationBarTitleText": "编辑银行账单" } },
    { "path": "pages/money/ali-pay-edit/ali-pay-edit", "style": { "navigationBarTitleText": "编辑支付宝" } },
    { "path": "pages/money/we-chat-edit/we-chat-edit", "style": { "navigationBarTitleText": "编辑微信" } },
    { "path": "pages/money/bill-upload-edit/bill-upload-edit", "style": { "navigationBarTitleText": "编辑上传规则" } },
    { "path": "pages/file/image/image", "style": { "navigationBarTitleText": "图片管理" } },
    { "path": "pages/system/user/user", "style": { "navigationBarTitleText": "用户管理" } },
    { "path": "pages/system/role/role", "style": { "navigationBarTitleText": "角色管理" } },
    { "path": "pages/system/menu/menu", "style": { "navigationBarTitleText": "菜单管理" } },
    { "path": "pages/system/category/category", "style": { "navigationBarTitleText": "分类管理" } },
    { "path": "pages/system/user-edit/user-edit", "style": { "navigationBarTitleText": "编辑用户" } },
    { "path": "pages/system/role-edit/role-edit", "style": { "navigationBarTitleText": "编辑角色" } },
    { "path": "pages/system/menu-edit/menu-edit", "style": { "navigationBarTitleText": "编辑菜单" } },
    { "path": "pages/system/category-edit/category-edit", "style": { "navigationBarTitleText": "编辑分类" } },
    { "path": "pages/setting/account/account", "style": { "navigationBarTitleText": "账号设置" } },
    { "path": "pages/setting/password/password", "style": { "navigationBarTitleText": "修改密码" } },
    { "path": "pages/dashboard/workplace", "style": { "navigationBarTitleText": "仪表盘" } }
  ],
  "tabBar": {
    "color": "#999999",
    "selectedColor": "#007aff",
    "borderStyle": "black",
    "backgroundColor": "#ffffff",
    "list": [
      { "pagePath": "pages/home/home", "iconPath": "static/tabbar/home.png", "selectedIconPath": "static/tabbar/home-active.png", "text": "首页" },
      { "pagePath": "pages/blog/article/article", "iconPath": "static/tabbar/blog.png", "selectedIconPath": "static/tabbar/blog-active.png", "text": "博客" },
      { "pagePath": "pages/mine/mine", "iconPath": "static/tabbar/mine.png", "selectedIconPath": "static/tabbar/mine-active.png", "text": "我的" }
    ]
  },
  "globalStyle": {
    "navigationBarTextStyle": "black",
    "navigationBarTitleText": "管理后台",
    "navigationBarBackgroundColor": "#ffffff",
    "backgroundColor": "#f8f8f8"
  }
}
```

### 8. 关键设计决策

| 决策 | 选择 | 理由 |
|------|------|------|
| Modal vs 新页面 | **新页面导航** | 移动端屏幕小，弹窗体验差；uni-app 的 `navigateTo` 天然支持 |
| 表格 vs 列表 | **Cell 列表** | 移动端不适合宽表格；`u-cell-item` 是最自然的移动端列表模式 |
| 搜索 vs 筛选 | **u-search + u-dropdown** | 简单关键词用搜索框，多条件筛选用下拉菜单 |
| 操作按钮 | **u-swipe-action 左滑 + u-fab 浮动** | 符合移动端操作习惯 |
| Hooks 分层 | **保留** | 与 admin-web 保持一致的代码组织，便于维护 |
| Markdown 编辑 | **简化为 textarea** | 移动端不适合复杂编辑器，后续可集成第三方 |
| 图表 | **暂用列表替代** | 图表在移动端需要额外库(ucharts)，首期用数据列表 + 标签展示 |

---

这个计划是否符合您的需求？有什么需要调整的地方吗？

---

## User

文章编辑 Markdown 的编辑有什么相应的组件吗

---

## Assistant (Plan · GLM-5.1 · 98.9s)

我来查找一下 uni-app 的 Markdown 编辑器组件。

**Tool: task**

**Input:**
```json
{
  "description": "Find uni-app markdown editors",
  "prompt": "Search for Markdown editor components available for uni-app / uni-app x. I need to find:\n\n1. Check if there are any markdown editor plugins already in the project's uni_modules directory: packages/admin-mobile/uni_modules/\n2. Search the web or known sources for popular uni-app markdown editor plugins, especially ones compatible with Vue 3 + uni-app\n\nKey requirements:\n- Must work in uni-app (Vue 3) environment\n- Should support both editing and preview\n- Ideally available on the DCloud plugin market (ext.dcloud.net.cn)\n\nReturn a list of available options with their names, URLs, and key features.",
  "subagent_type": "explore"
}
```

**Output:**
```
task_id: ses_1b49a9829ffewaw9xBiDxjQtqV (for resuming to continue this task if needed)

<task_result>
Here are my complete findings:

---

## 1. Project Local Check: No Markdown Editor Installed

The `packages/admin-mobile/uni_modules/` directory contains only one plugin:

- `uview-pro/` -- the uView Pro UI framework

**No markdown editor or markdown-related plugin exists in the project.** The `package.json` also has no markdown-related dependencies.

---

## 2. DCloud Plugin Market Search Results

I searched extensively across the DCloud plugin market (ext.dcloud.net.cn). The market has **~27 Markdown-related frontend component plugins**, but the vast majority are **renderers/viewers only** (for displaying Markdown content), **not editors** (for editing + preview). This is a critical distinction.

### CATEGORY A: Markdown Editor Plugins (Editing + Preview)

Only **1** plugin was found that specifically provides Markdown editing capability:

| # | Name | Plugin ID | URL | Vue 3 | Key Features |
|---|------|-----------|-----|-------|-------------|
| 1 | **md-editor** | 20679 | https://ext.dcloud.net.cn/plugin?id=20679 | Yes | Rich text editor with toolbar, keyboard-following toolbar, quick insert, fullscreen mode. **Note**: This is a general rich text editor named "md-editor", not a true split-pane Markdown editor with live preview. It supports Vue2/Vue3, H5 + WeChat Mini Program + App-vue. Very small footprint (25.7KB). Low adoption (93 downloads, 4 reviews). Last updated 2024-10-20. |

### CATEGORY B: Markdown Renderer/Viewer Plugins (Preview Only)

These plugins render Markdown content for display but do **not** provide editing capability. You would need to pair them with your own `textarea` or `editor` input component:

| # | Name | Plugin ID | URL | Vue 3 | Downloads | Stars | Key Features |
|---|------|-----------|-----|-------|-----------|-------|-------------|
| 1 | **zero-markdown-view** | 9437 | https://ext.dcloud.net.cn/plugin?id=9437 | Yes | 10,728 | 238 collections, 95 tips | **Most popular**. One-line usage. Custom theme colors, code highlighting, streaming output (AI mode), LaTeX formula support. Based on mp-html. Supports Vue2/Vue3, H5 + WeChat Mini Program. Package: 134.2KB. MIT license. **Last updated 2025-07-17 (v3.0.0).** |
| 2 | **uniapp markdown + code highlight (Vue3)** | 13307 | https://ext.dcloud.net.cn/plugin?id=13307 | Yes | 5,238 | 87 collections, 76 tips | Vue3-specific Markdown rendering with syntax highlighting. Works on H5 + Mini Program + App. Last updated 2024-02-27. |
| 3 | **markdown-render** | 19712 | https://ext.dcloud.net.cn/plugin?id=19712 | Yes | 1,064 | 36 collections, 10 tips | Markdown parsing with streaming output and code highlighting. GPT/LLM-oriented. Last updated 2025-03-25. |
| 4 | **jimo-markdown-view** | 24733 | https://ext.dcloud.net.cn/plugin?id=24733 | Yes | 157 | 5 collections | AI-oriented Markdown renderer. Custom themes, code highlighting, tables, images, audio/video, math expressions, streaming output. Last updated 2025-08-20. |
| 5 | **ux-markdown-view** | 26269 | https://ext.dcloud.net.cn/plugin?id=26269 | Yes | 185 | 9 collections | Based on mp-html. Streaming rendering, tables, code highlighting. Last updated 2026-01-27. |
| 6 | **xMarkdown** | 26725 | https://ext.dcloud.net.cn/plugin?id=26725 | Yes | Paid (1 purchase) | 3 collections | Vue3 syntax, standard Markdown formatting, streaming output, custom components. iOS/Android/Web. Last updated 2026-03-02. |
| 7 | **ikun-markdown** | 24280 | https://ext.dcloud.net.cn/plugin?id=24280 | Yes | 56 | 2 collections | Pure JS Markdown-to-AST-to-HTML conversion. WeChat Mini Program + H5. Last updated 2025-07-09. |
| 8 | **zy-markdown-render** | 23294 | https://ext.dcloud.net.cn/plugin?id=23294 | Yes | 49 | 5 collections | Markdown parsing, streaming output, code highlighting. Last updated 2025-04-30. |
| 9 | **ver-response** | 22642 | https://ext.dcloud.net.cn/plugin?id=22642 | Yes | 218 | 6 collections | Markdown formatter with LaTeX formula and code highlighting. AI-response oriented. Last updated 2025-03-16. |
| 10 | **jo-markdown (markdown parse)** | 6545 | https://ext.dcloud.net.cn/plugin?id=6545 | Unknown | 2,285 | 33 collections | Markdown format, formulas, emoji support. Last updated 2022-05-10 (outdated). |

### CATEGORY C: Markdown Parser SDKs (No UI, programmatic only)

| # | Name | Plugin ID | URL | Vue 3 | Key Features |
|---|------|-----------|-----|-------|-------------|
| 1 | **kux-marked** | 23385 | https://ext.dcloud.net.cn/plugin?id=23385 | UTS-based | High-performance UTS Markdown parser, 100% API compatible with `marked.js`. Custom renderer/tokenizer support. For uni-app x (Web/Android/iOS/Harmony/WeChat). 246 downloads. Last updated 2025-08-09. |
| 2 | **uni-cmark** | 25897 | https://ext.dcloud.net.cn/plugin?id=25897 | UTS-based | C-based cmark-gfm wrapper as UTS plugin. By DCloud official team. 201 downloads. Last updated 2026-01-07. |

---

## 3. Recommended Approach for Your Project

Given your requirements (**Vue 3 + uni-app, editing + preview, blog admin mobile**), here is my assessment:

### Option A: Combine `zero-markdown-view` + custom `textarea` (RECOMMENDED)
- Use **zero-markdown-view** (the most popular and actively maintained renderer) for the preview side
- Build a simple editing UI with `textarea` + toolbar buttons (bold, italic, heading, etc.) that insert Markdown syntax
- Toggle between edit mode and preview mode
- **Pros**: Battle-tested, 10,728+ downloads, actively updated, streaming output, LaTeX support
- **Cons**: You need to build the editor toolbar yourself

### Option B: Use `md-editor` plugin as-is
- The only actual "editor" plugin on the market
- **Pros**: Ready-to-use editing UI with toolbar
- **Cons**: It is a general rich text editor (not split-pane Markdown editor), very low adoption (93 downloads, last updated Oct 2024), limited community support, no live Markdown preview

### Option C: Build a custom component combining `kux-marked` + `editor`
- Use the built-in uni-app `<editor>` component (rich text editor) for input
- Use **kux-marked** or **zero-markdown-view** for rendering the Markdown preview
- **Pros**: Full control, native editor component
- **Cons**: More development effort

### Key Consideration for uni-app
The uni-app environment has significant limitations compared to web:
- No DOM access on Mini Program platforms
- No `contenteditable` on Mini Programs
- Most web-based Markdown editors (like CodeMirror, toast-ui, md-editor-v3) **will not work** on Mini Program or native App targets
- For H5-only mode, you could use web-based editors, but cross-platform compatibility would be lost

**The most practical path for a cross-platform uni-app Vue 3 project is Option A**: pair `zero-markdown-view` with a custom editing surface.
</task_result>
```

**Tool: glob**

**Input:**
```json
{
  "pattern": "packages/admin-mobile/uni_modules/*"
}
```

**Output:**
```
No files found
```

---

## Assistant (Plan · GLM-5.1 · 3.1s)

**Tool: glob**

**Input:**
```json
{
  "pattern": "packages/admin-mobile/uni_modules/*/"
}
```

**Output:**
```
No files found
```

---

## Assistant (Plan · GLM-5.1 · 3.2s)

**Tool: bash**

**Input:**
```json
{
  "command": "ls \"E:/program/Front/blog/blog-monorepo/packages/admin-mobile/uni_modules/\"",
  "description": "List uni_modules directory"
}
```

**Output:**
```
uview-pro

```

---

## Assistant (Plan · GLM-5.1 · 17.6s)

当前项目中没有现成的 Markdown 编辑组件。以下是 uni-app 生态中可用的方案：

---

### 可用 Markdown 编辑方案

| 方案 | 组件 | 特点 | 推荐度 |
|------|------|------|--------|
| **A: zero-markdown-view + textarea** | [插件地址](https://ext.dcloud.net.cn/plugin?id=9437) | 最流行的渲染器(10,728下载)，配合自定义 textarea + 工具栏，编辑/预览切换模式 | **推荐** |
| **B: md-editor** | [插件地址](https://ext.dcloud.net.cn/plugin?id=20679) | DCloud 市场唯一的"编辑器"插件，带工具栏，但下载量仅93，非真正的分屏预览 | 一般 |
| **C: uni-app 内置 editor + 渲染** | `<editor>` 组件 | uni-app 内置富文本编辑器，配合 zero-markdown-view 预览 | 可行但开发量大 |

### 推荐方案 A 的设计

```
文章编辑页:
┌──────────────────────┐
│  标题: [u-input]      │
│  简介: [u-textarea]   │
│  分类: [u-select]     │
│  加密: [u-switch]     │
├──────────────────────┤
│  [编辑] [预览]  ← u-subsection 切换  │
├──────────────────────┤
│  编辑模式:            │
│  ┌──────────────────┐ │
│  │ B I H1 H2 | Link│ │ ← 自定义工具栏
│  ├──────────────────┤ │
│  │ textarea         │ │ ← 输入 Markdown
│  │                  │ │
│  └──────────────────┘ │
│  预览模式:            │
│  ┌──────────────────┐ │
│  │ zero-markdown-   │ │ ← 渲染 Markdown
│  │ view             │ │
│  └──────────────────┘ │
├──────────────────────┤
│  [保存]  [加密保存]    │
└──────────────────────┘
```

**核心思路**：
- 编辑和预览是两个 Tab（`u-subsection` 切换），不做实时分屏（移动端屏幕不够）
- 编辑模式：顶部简易工具栏（插入 Markdown 语法符号）+ `textarea`
- 预览模式：`zero-markdown-view` 渲染最终效果
- 工具栏按钮点击时向 textarea 插入对应语法（`**粗体**`、`## 标题` 等）

是否采用这个方案？还是你有其他偏好？

---

## User

还是按照最初- markdownContent: u-textarea (移动端简化，不做Markdown实时预览)的方式

---

## Assistant (Plan · GLM-5.1 · 12.3s)

_Thinking:_

The user confirms they want the simple approach - just use `u-textarea` for markdown content without Markdown preview/editing features. Let me update the plan accordingly and confirm the final plan is ready.

Let me also make sure I have the complete plan finalized and ask if they're ready to proceed.

好的，文章编辑页的 `markdownContent` 就用 `u-textarea` 简化处理，不做 Markdown 预览。

那整体计划确认如下，与之前的方案一致，只有这一点调整。是否可以开始实施？

**最终确认的要点**：

1. **3个 TabBar**: 首页 / 博客(文章) / 我的
2. **Modal → 新页面导航**（编辑页独立路由）
3. **表格 → u-cell-item 列表** + `u-loadmore` 上拉加载
4. **操作 → u-swipe-action 左滑** + `u-fab` 浮动新建按钮
5. **搜索 → u-search + u-dropdown 筛选**
6. **表单 → u-form + u-form-item** 体系
7. **Hooks 分层保留**
8. **markdownContent → u-textarea**（不做预览）
9. **图表 → 列表替代**（财务汇总暂用数据列表）
10. **共 28 个页面路由**（含 3 个 TabBar 页 + 登录页 + 各业务列表/编辑页 + 设置页）
11. **需先建基础设施**: `utils/request.ts`、`utils/auth.ts`、`api/`、`store/`、`components/list-page/`

如有需要调整的地方请告知，否则我就按此方案开始创建。

---

