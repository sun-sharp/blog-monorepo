# Changelog

- bm-xxx 表示只修改了主项目里的代码
- bm-ns-xxx 表示修改了子项目node-server的代码
- bm-www-xxx 表示修改了子项目website的代码
- bm-aw-xxx 表示修改了子项目admin-web的代码
- bm-am-xxx 表示修改了子项目admin-mobile的代码
- bm-ns-www-aw-am-xxx 表示修改了子项目node-server、website、admin-web、admin-mobile的代码

## bm-www-4.0.1 (2026-8-4)
- 修改www端运行报错
- 添加www端h5端访问方式

## bm-ns-www-am-4.0.0 (2026-8-4)
- 优化 移动端分页/输入框/悬浮按钮/余额处理 
  - 移动端列表分页改为每页20条
  - 表单页添加softinputMode解决键盘遮挡输入框
  - 悬浮按钮改用纯CSS定位兼容各端
  - 余额处理接口改用bulkWrite优化性能
  - 请求层添加超时配置和错误提示
- 修改 server 和 移动端的代码验证
- 修改 website 打包问题
- 修改 移动端 财务列表 展示

## 2.1.2 (2026-8-1)
- 三表聚合分页查询参数修改（aggregate.d.ts）

## 2.1.0 (2026-8-1)
- 移动端和后端分别修改
- 添加三表聚合账单类型定义（aggregate.d.ts）
  - ApiAggregateBillItem 聚合账单列表项
  - ApiAggregateBillDetail 聚合账单详情
  - ApiAggregateBillFindPageData 聚合分页查询参数
  - ApiAggregateBillUpdateData 聚合修改参数


## 2.0.0
- Monorepo 项目结构重构
- 共享类型目录 `packages/shared/types/`
- 统一的路径别名配置
- 整合类型定义到共享目录结构
- 后端: update/create 方法补上 code 字段
- 移动端: 1、bill-upload-edit 去掉弹窗提示改为行内显示字段说明 2、优化所有编辑页面样式


## 子项目的各版本

### 移动端的管理平台系统
- [admin-mobile/CHANGELOG.md](./packages/admin-mobile/CHANGELOG.md)

### 官网站点
- [website/CHANGELOG.md](./packages/website/CHANGELOG.md)

### web端的管理平台系统
- [admin-web/CHANGELOG.md](./packages/admin-web/CHANGELOG.md)

### 后端、中间件的接口
- [node-server/CHANGELOG.md](./packages/node-server/CHANGELOG.md)
