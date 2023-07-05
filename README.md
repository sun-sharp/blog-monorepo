#alone-blog-api

## 简介

运用 [nestjs](https://docs.nestjs.cn) 开发博客的接口

## 安装

```bash
$ yarn
```

## 运行

```bash
# development
$ yarn start

# watch mode
$ yarn start:dev

# production mode
$ yarn start:prod
```

## 测试

```bash
# unit tests
$ yarn test

# e2e tests
$ yarn test:e2e

# test coverage
$ yarn test:cov
```

## 文档

```bash
$ yarn compodoc
```

## 部署

```bash

# 在服务器中拉取代码项目
$ git init
$ git remote add origin git@github.com:sun-sharp/alone-blog-api.git
$ git pull origin main
# or
$ git pull origin main

# 安装插件
$ yarn

# 暂停进程/应用
$ pm2 stop nest

# 删除进程/应用
$ pm2 delete nest

# 打包
$ yarn build

# 列出所有进程/应用
$ pm2 list

# 添加进程/应用 nest
$ pm2 start --name nest dist/main.js

```

``` bash
# 或者
# 先拉取全部远程分支和tag
$ git fetch origin

# 切换到最新tag上
$ git checkout aba-xxx

# 打包部署应用 nest
$ yarn update_main_pm2

```
