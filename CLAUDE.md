# CLAUDE.md - alone-blog-api 项目文档

## 项目概述

alone-blog-api 是一个基于 NestJS 开发的个人博客和财务管理 API 系统。项目提供了完整的博客管理功能和智能的账单导入分析系统，支持微信、支付宝和多家银行的账单导入、分类和分析。

**核心功能**：
- 博客管理系统：文章、分类、图片管理
- 财务管理：微信、支付宝、银行账单导入和分析
- 用户权限管理：JWT认证、角色权限、菜单管理
- 待办事项和日程管理
- 文件上传和图片管理
- 定时任务：数据备份、任务清理等

**版本**: 2.6.0

## 技术栈

- **框架**: NestJS 10.2.7
- **数据库**: MongoDB + Mongoose 7.6.4
- **语言**: TypeScript 5.2.2
- **认证**: JWT + Passport
- **Excel处理**: exceljs 4.4.0
- **PDF生成**: puppeteer 22.3.0
- **文档**: Swagger + Compodoc
- **任务调度**: @nestjs/schedule 4.0.0

## 项目结构

```
src/
├── app.module.ts              # 主应用模块
├── app.controller.ts          # 主控制器
├── app.service.ts             # 主服务
├── common/                    # 公共工具模块
│   ├── array.ts              # 数组处理工具
│   ├── bcrypt.ts             # 加密工具
│   ├── constant/             # 常量定义
│   │   ├── config.ts         # 配置常量
│   │   └── excel.ts          # Excel处理常量（重点）
│   ├── date.ts               # 日期处理工具
│   ├── dto/                  # 公共DTO
│   ├── enums/                # 枚举定义
│   │   ├── api-code.enum.ts  # API状态码枚举
│   │   ├── category.enum.ts  # 分类枚举
│   │   ├── money.enum.ts     # 金钱相关枚举（重点）
│   │   └── paginate.enum.ts  # 分页枚举
│   ├── exception/            # 异常处理
│   ├── excel.ts              # Excel处理工具（重点）
│   ├── fs-handle.ts          # 文件系统处理
│   ├── journal.ts            # 日志工具
│   ├── paginate/             # 分页处理
│   └── validator/            # 验证器
├── config/                   # 配置文件
│   ├── index.ts             # 配置主文件
│   ├── dev.ts               # 开发环境配置
│   └── prod.ts              # 生产环境配置
├── jwt/                     # JWT认证模块
├── modules/                 # 业务模块
│   ├── blog/               # 博客模块
│   │   ├── article/        # 文章管理
│   │   ├── money/          # 财务管理（核心）
│   │   │   ├── ali-pay/    # 支付宝账单
│   │   │   ├── bank/       # 银行账单（支持5家银行）
│   │   │   ├── bill-upload/ # 账单导入配置
│   │   │   └── we-chat/    # 微信账单
│   │   └── schedule/       # 日程管理
│   └── capital/            # 资本管理模块
│       ├── category/       # 分类管理
│       ├── configuration/  # 配置管理
│       ├── image/          # 图片管理
│       ├── menu/           # 菜单管理
│       ├── role/           # 角色管理
│       ├── user/           # 用户管理
│       └── wait-for-do/    # 待办事项管理
├── schemas/                 # MongoDB Schema定义
│   ├── blog/               # 博客相关Schema
│   └── capital/            # 资本管理相关Schema
├── tasks/                   # 定时任务模块
└── types/                   # TypeScript类型定义
types/                      # 全局类型定义
├── blog/                   # 博客相关类型
├── capital/                # 资本管理相关类型
├── common/                 # 公共类型
└── config.d.ts             # 配置类型
```

## 环境设置

### 前置要求
- Node.js v24.14.0 或更高版本
- MongoDB 数据库
- Git

### 安装步骤

1. **克隆项目**
   ```bash
   git clone git@github.com:sun-sharp/alone-blog-api.git
   cd alone-blog-api
   ```

2. **安装依赖**
   ```bash
   # 推荐使用yarn
   yarn
   # 或使用npm
   npm install
   ```

3. **全局安装NestJS CLI（可选）**
   ```bash
   npm i -g @nestjs/cli
   ```

4. **数据库配置**
   - 在 `store/json/database/` 目录下创建配置文件：
     - `dev.json` - 开发环境数据库配置
     - `prod.json` - 生产环境数据库配置
   - 配置文件格式：
     ```json
     {
       "serverIp": "mongodb服务器地址",
       "databasePort": 27017,
       "mongodbAccount": "数据库账号",
       "mongodbPassword": "数据库密码",
       "mongodbQuery": "?authSource=admin&readPreference=primary&ssl=false"
     }
     ```

5. **创建存储目录**
   ```bash
   # 项目会自动创建必要的目录结构
   ```

## 运行项目

### 开发环境
```bash
# 开发环境运行（热重载）
yarn start:dev

# 开发环境运行（带调试）
yarn start:dev_watch_debug
```

### 生产环境
```bash
# 生产环境运行
yarn start:prod

# 生产环境运行（带调试）
yarn start:prod_watch_debug
```

### 构建项目
```bash
# 清理dist目录并构建
yarn build
```

## 核心功能说明

### 账单导入系统

项目最具特色的功能是智能账单导入系统，支持三种账单类型：

#### 1. 微信账单导入 (`we-chat`)
- 支持微信账单Excel/CSV格式
- 自动从第19行开始读取数据（适配微信账单格式）
- 智能识别重复数据

#### 2. 支付宝账单导入 (`ali-pay`)
- 支持支付宝账单Excel/CSV格式
- 自动分类处理

#### 3. 银行账单导入 (`bank`)
- 支持5家银行：工商银行、农业银行、建设银行、民生银行、招商银行
- 每种银行有独立的解析规则

#### 账单导入配置系统 (`bill-upload`)
智能配置系统，通过规则自动为导入的账单数据添加：
- **流入/流出标识** (`inflowOrOutflow`)
- **账单类型** (`billType`) - 如：红包、水电费、交通等
- **账单方式** (`billMethod`) - 如：微信零钱、支付宝余额、各银行等

### 账单导入流程
1. 用户上传Excel/CSV文件
2. 系统解析文件，根据预定义的列映射规则转换数据
3. 过滤数据库中已存在的数据
4. 通过`bill-upload`配置系统自动分类
5. 保存到对应的数据库集合

### 关键文件
- **Excel处理常量**: `src/common/constant/excel.ts` - 定义各银行Excel列映射
- **Excel处理工具**: `src/common/excel.ts` - 文件解析和数据转换
- **金钱相关枚举**: `src/common/enums/money.enum.ts` - 账单类型、方式等枚举

## API文档

### Swagger接口文档
项目集成了Swagger，启动后访问：
- 开发环境: `http://localhost:3002/api`
- 生产环境: `http://your-domain/api`

### Compodoc代码文档
生成项目代码文档：
```bash
yarn compodoc
```
访问: `http://localhost:8000`

## 部署指南

### 开发环境部署 (dev分支)
```bash
# 切换到dev分支
git checkout dev

# 更新并部署
npm run update_dev_pm2
# 或手动步骤：
npm install
pm2 stop dev_nest
pm2 delete dev_nest
npm run build
cross-env RUNNING_ENV=dev pm2 start --name dev_nest dist/main.js
```

### 生产环境部署 (main分支或tag)
```bash
# 使用main分支
git pull origin main

# 或使用tag
git tag -l -n  # 查看所有tag
git checkout aba-xxx  # 切换到指定tag

# 更新并部署
npm run update_prod_pm2
# 或手动步骤：
npm install
pm2 stop nest
pm2 delete nest
npm run build
cross-env RUNNING_ENV=prod pm2 start --name nest dist/main.js
```

## 开发指南

### 创建新模块
```bash
# 使用Nest CLI创建新资源
nest g res modules/blog/schedule
```

### 数据库Schema
- 所有Schema定义在 `src/schemas/` 目录下
- 按模块分类：`blog/` 和 `capital/`
- 使用装饰器定义MongoDB集合

### 添加新账单类型
1. 在 `src/modules/blog/money/` 下创建新目录
2. 创建对应的Service、Controller、DTO
3. 在 `src/schemas/blog/money/` 下创建Schema
4. 在 `src/common/constant/excel.ts` 中添加Excel列映射
5. 在 `src/common/enums/money.enum.ts` 中添加相关枚举
6. 在BlogModule中注册新模块

### 代码规范
- 使用ESLint和Prettier进行代码格式化
- 运行 `yarn lint` 和 `yarn format` 格式化代码
- 遵循现有的模块化结构

## 常见问题

### 1. Puppeteer安装问题（PDF导出）
**问题**: 在CentOS上导出PDF报错或中文乱码

**解决方案**:
```bash
# 安装Chromium
sudo yum install epel-release
sudo yum install -y chromium

# 安装中文字体
sudo yum search wqy
sudo yum install wqy-microhei-fonts.noarch -y
sudo yum install wqy-unibit-fonts.noarch -y
```

### 2. 数据库连接失败
**检查**:
1. 确认 `store/json/database/` 下的配置文件存在且格式正确
2. 确认MongoDB服务正常运行
3. 检查数据库账号密码权限

### 3. 账单导入数据为0
**可能原因**:
1. Excel文件格式不符合预期
2. 开始行号配置不正确（微信账单从第19行开始）
3. 列映射规则不匹配

**解决方案**:
- 检查 `src/common/constant/excel.ts` 中的列映射配置
- 验证Excel文件格式是否符合对应账单类型的要求

### 4. 图片上传路径问题
项目使用环境相关的路径配置：
- 开发环境: `api_dev_file` 和 `api_dev_static_dir`
- 生产环境: 根据生产配置

确保对应的静态文件目录存在且具有读写权限。

## 维护和监控

### PM2管理
```bash
# 查看进程状态
pm2 list

# 查看日志
pm2 logs dev_nest  # 开发环境
pm2 logs nest      # 生产环境

# 重启进程
pm2 restart dev_nest
pm2 restart nest

# 停止进程
pm2 stop dev_nest
pm2 stop nest
```

### 日志系统
- 项目使用统一的日志系统 `src/common/journal.ts`
- 日志记录在项目日志目录中
- 包含操作日志和错误日志

### 定时任务
- 数据备份任务：定期备份数据库数据
- 任务清理：清理一周前已完成的任务
- 其他维护任务

## 更新日志
详细更新记录请查看 [CHANGELOG.md](./CHANGELOG.md)

---

**最后更新**: 2026年4月25日  
**项目维护者**: yrr  
**技术支持**: 参考README.md和项目文档
