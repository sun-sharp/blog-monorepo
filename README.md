#alone-blog-api

## 简介

运用 [nestjs](https://docs.nestjs.cn) 开发博客的接口

## 安装

```bash
$ yarn
```

## 运行

```bash
# 运行dev的内容
$ yarn start:dev

# 运行prod的内容
$ yarn start:prod
```

## 生产接口文档

```bash
$ yarn compodoc
```

## 部署

### 在服务器中拉取代码项目
``` bash
$ git init
$ git remote add origin git@github.com:sun-sharp/alone-blog-api.git
$ git pull origin main
# or
$ git clone git@github.com:sun-sharp/alone-blog-api.git
```

### 部署dev环境

``` bash
# 先拉取全部远程分支和tag
$ git fetch origin

# 切换到dev分支上
$ git checkout dev

# 拉取一下最新代码
$ git pull origin dev

# 打包部署应用 dev_nest
$ yarn
$ pm2 stop dev_nest
$ pm2 delete dev_nest
$ yarn build:dev
$ pm2 list
$ pm2 start --name dev_nest dist/main.js # 添加进程/应用 dev_nest
# or
$ yarn update_dev_pm2

```

### 用main部署生产prod

```bash
# 在服务器中拉取代码项目

$ git pull origin main
# or
$ git pull origin main



```

### 用tag部署生产prod

``` bash
# 先拉取全部远程分支和tag
$ git fetch origin

# 查看所有tag
$ git tag -l -n

# 切换到最新tag上
$ git checkout aba-xxx

# 打包部署应用 nest
$ yarn # 安装插件
$ pm2 stop nest # 暂停进程/应用
$ pm2 delete nest # 删除进程/应用
$ yarn build:prod # 打包
$ pm2 list # 列出所有进程/应用
$ pm2 start --name nest dist/main.js # 添加进程/应用 nest
# or
$ yarn update_main_pm2

```
