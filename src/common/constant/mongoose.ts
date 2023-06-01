import { MongooseModule } from '@nestjs/mongoose';
import { getEnvConfig } from '../env-config';

const envConfig = getEnvConfig();

const { mongodbAccount, mongodbPassword, serverIp, databasePort, mongodbQuery } = envConfig;
// 账号登录
const mongodbAccountAndPassword = mongodbAccount && mongodbPassword ? `${mongodbAccount}:${mongodbPassword}@` : '';
// mongodb路径的基础配置
const mongodbBaseUrl = `mongodb://${mongodbAccountAndPassword}${serverIp}:${databasePort}`;
console.log(mongodbBaseUrl, mongodbQuery, 'mongodbBaseUrl');

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
