#alone-blog-api

## 简介

运用 [nestjs](https://docs.nestjs.cn) 开发博客的接口

## 安装

```bash
$ node v20.10.0

$ yarn

$ npm i -g @nestjs/cli

$ nest --help

# 创建当前目录下的CRUD
$ nest g res modules/blog/schedule
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

```bash
$ git init
$ git remote add origin git@github.com:sun-sharp/alone-blog-api.git
$ git pull origin main
# or
$ git clone git@github.com:sun-sharp/alone-blog-api.git
```

### 部署dev环境

```bash
# 清空本地的修改
$ git reset --hard HEAD

# 先拉取全部远程分支和tag
$ git fetch --prune

# 切换到dev分支上
$ git checkout dev

# 拉取一下最新代码
$ git pull origin dev

# 打包部署应用 dev_nest
$ yarn
$ pm2 stop dev_nest
$ pm2 delete dev_nest
$ yarn build
$ pm2 list
$ cross-env RUNNING_ENV=dev pm2 start --name dev_nest dist/main.js # 添加进程/应用 dev_nest
# or
$ yarn update_dev_pm2

```

### 用main部署生产prod

```bash
# 在服务器中拉取代码项目
$ git pull origin main

```

### 用tag部署生产prod

```bash
# 清空本地的修改
$ git reset --hard HEAD

# 先拉取全部远程分支和tag
$ git fetch --prune

# 查看所有tag
$ git tag -l -n

# 切换到最新tag上
$ git checkout aba-xxx

# 打包部署应用 nest
$ yarn # 安装插件
$ pm2 stop nest # 暂停进程/应用
$ pm2 delete nest # 删除进程/应用
$ yarn build # 打包
$ pm2 list # 列出所有进程/应用
$ cross-env RUNNING_ENV=prod pm2 start --name nest dist/main.js # 添加进程/应用 nest
# or
$ yarn update_prod_pm2

```

### 部署注意的问题

##### 关于 puppeteer 安装问题

1. 导出pdf在 CentOS 上会报错
2. 首先安装工具包以及安装chromium

```bash
$ sudo yum install epel-release

$ sudo yum install -y chromium
```

3. Puppeteer 导出的 pdf 会出现部分中文显示乱码

这并不是Puppeteer的问题，实际上是Linux字体库对中文支持不好的原因。
需要给服务器的Linux系统安装支持的中文字体库即可

```bash
# 查找文泉驿安装包
$ sudo yum search wqy

# 安装文泉驿字体
$ sudo yum install wqy-microhei-fonts.noarch -y
$ sudo yum install wqy-unibit-fonts.noarch -y
```
