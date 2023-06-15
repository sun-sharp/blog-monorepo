import { MongooseModule } from '@nestjs/mongoose';
import { useCustomConfig } from 'src/config';
import { logger } from '../journal';

const customConfig = useCustomConfig();

const { mongodbAccount, mongodbPassword, serverIp, databasePort, mongodbQuery } = customConfig;
// 账号登录
const mongodbAccountAndPassword = mongodbAccount && mongodbPassword ? `${mongodbAccount}:${mongodbPassword}@` : '';
// mongodb路径的基础配置
const mongodbBaseUrl = `mongodb://${mongodbAccountAndPassword}${serverIp}:${databasePort}`;
logger.log(mongodbBaseUrl, mongodbQuery, 'mongodb配置信息');

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
