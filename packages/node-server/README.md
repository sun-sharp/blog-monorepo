#node-server

## 简介

运用 [nestjs](https://docs.nestjs.cn) 开发博客的接口

## 拉取代码

```bash
git init
git remote add origin git@github.com:sun-sharp/node-server.git
git pull origin main
# or
git clone git@github.com:sun-sharp/node-server.git
```

## 安装

```bash
node v24.14.0

# npm i，yarn如果安装报错
yarn

npm i -g @nestjs/cli

nest --help

# 创建当前目录下的CRUD
nest g res modules/blog/schedule
```

## 运行

### 先创建根目录下的.env文件

```bash
# 运行
npm run start
```

- 或者打开vscode 运行node_server

## 生产接口文档

```bash
npm run compodoc
```

## 部署

### 先运行打包
```bash
npm run build
```

### 放到服务器并配置

1. 创建目录
```bash
cd /www/wwwroot/nestApi

# 没有就创建目录
mkdir /www/wwwroot/nestApi

```
2. 将dist里的数据放到nestApi目录下
3. 在nestApi目录下运行 npm install 安装依赖
4. 放入或创建ecosystem.config.js配置
```js
module.exports = {
  apps: [
    {
      name: 'nest_dev', // 进程名称，用于 pm2 管理[reference:1]
      script: 'src/main.js',  // 入口文件，NestJS 打包后是 main.js[reference:2]
      cwd: '/www/wwwroot/nestApi',  // 【重要】必须修改为你的项目绝对路径[reference:3]
      exec_mode: 'fork',  // 单进程模式
      instances: 1, // 只启动一个实例
      env: {
        PORT: 3002, // 指定该进程监听 3002 端口
        // 你可以在下面添加其他环境变量，如数据库连接字符串等
      },
    },
    {
      name: 'nest', // 进程名称，用于 pm2 管理[reference:1]
      script: 'src/main.js',  // 入口文件，NestJS 打包后是 main.js[reference:2]
      cwd: '/www/wwwroot/nestApi',  // 【重要】必须修改为你的项目绝对路径[reference:3]
      exec_mode: 'fork',  // 单进程模式
      instances: 1, // 只启动一个实例
      env: {
        PORT: 3000, // 指定该进程监听 3000 端口
        // 可以为这个实例配置不同的环境变量，如连接不同的数据库
      },
    },
  ],
};
```


### 部署并运行

```bash
npm install # 安装插件
pm2 list # 列出所有进程/应用

# 第一次运行
pm2 start ecosystem.config.js

# 如果没改配置文件里的 env，用这个（不停服，最安全）
pm2 reload ecosystem.config.js

# 如果改了 .env 或 ecosystem 里的环境变量，用这个（强制刷新变量）
pm2 restart ecosystem.config.js --update-env

# or
# npm install && pm2 list && pm2 reload ecosystem.config.js
npm run update_pm2

# pm2 暂停
pm2 stop dev_nest
# pm2 删除
pm2 delete dev_nest

```

### 部署注意的问题

##### 关于 puppeteer 安装问题

1. 导出pdf在 CentOS 上会报错
2. 首先安装工具包以及安装chromium

```bash
sudo yum install epel-release

sudo yum install -y chromium
```

3. Puppeteer 导出的 pdf 会出现部分中文显示乱码

这并不是Puppeteer的问题，实际上是Linux字体库对中文支持不好的原因。
需要给服务器的Linux系统安装支持的中文字体库即可

```bash
# 查找文泉驿安装包
sudo yum search wqy

# 安装文泉驿字体
sudo yum install wqy-microhei-fonts.noarch -y
sudo yum install wqy-unibit-fonts.noarch -y
```

##### 关于数据备份功能（MongoDB Database Tools）

二进制备份/恢复依赖 `mongodump` 和 `mongorestore`，需安装 MongoDB Database Tools。

1. 下载地址：https://www.mongodb.com/try/download/database-tools
2. 解压后将 `bin` 目录路径配置到 `.env` 中的 `MONGODB_BIN_PATH`

```bash
# Windows 示例
MONGODB_BIN_PATH=C:\Program Files\MongoDB\Tools\100\bin

# Linux 示例
MONGODB_BIN_PATH=/usr/local/mongodb-database-tools/bin
```

留空则从系统 PATH 查找。Linux 也可直接安装到系统路径：

```bash
# CentOS
sudo yum install -y mongodb-database-tools
```
