import { MongooseModule } from '@nestjs/mongoose';

// 账号
const account = 'yrr';
// 密码
const password = 'AlyYrrAdmin123';
// 服务器ip地址
const serverIp = '120.79.162.189';
// 数据库端口
const databasePort = '5606';
// mongodb路径的基础配置
const mongodbBaseUrl = `mongodb://${account}:${password}@${serverIp}:${databasePort}`;
// mongodb的参数信息
const mongodbQuery = '?authSource=admin';

// capital的mongoose配置
export const capitalMongooseModuleForRoot = MongooseModule.forRoot(`${mongodbBaseUrl}/capital${mongodbQuery}`, {
  connectionName: 'capital',
});

// money的mongoose配置
export const moneyMongooseModuleForRoot = MongooseModule.forRoot(`${mongodbBaseUrl}/money${mongodbQuery}`, {
  connectionName: 'money',
});

// file的mongoose配置
export const fileMongooseModuleForRoot = MongooseModule.forRoot(`${mongodbBaseUrl}/file${mongodbQuery}`, {
  connectionName: 'file',
});

// blog的mongoose配置
export const blogMongooseModuleForRoot = MongooseModule.forRoot(`${mongodbBaseUrl}/blog${mongodbQuery}`, {
  connectionName: 'blog',
});
