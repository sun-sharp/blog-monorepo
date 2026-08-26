# admin-mobile

## 介绍

是基于[Vue3.0](https://github.com/vuejs/vue-next) + [TypeScript](https://www.typescriptlang.org/) + [Vite](https://github.com/vitejs/vite) 的模板

## 安装使用

- 安装依赖

```bash
cd admin-mobile
npm install
```

### scripts

```bash
# 执行 eslint 校验，并修复部分问题
npm run lint

# 删除 node_modules 和 一些安装的lock文件
npm run rm_node_modules
```

## 注意

### 升级uview-pro插件时
- u-fab: 新增 size/btnCustomStyle props，通过行内样式控制按钮尺寸，解决小程序端 :deep CSS 穿透无效问题


## 鸿蒙安装

```bash
cd '.\program\hm\DevEco Studio\sdk\default\openharmony\toolchains\'
```

路径：D:\program\hm\DevEco Studio\sdk\default\openharmony\toolchains>
先卸载手机端的软件
```bash
hdc install E:\program\Front\blog\blog-monorepo\packages\admin-mobile\unpackage\dist\build\app-harmony\entry\build\release\outputs\default\entry-default-signed.hap
```