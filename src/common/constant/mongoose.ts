import { MongooseModule } from '@nestjs/mongoose';

// capital的mongoose配置
export const capitalMongooseModuleForRoot = MongooseModule.forRoot('mongodb://yrr:AlyYrrAdmin123@120.79.162.189:5606/capital?authSource=admin', {
  connectionName: 'capital',
});

// money的mongoose配置
export const moneyMongooseModuleForRoot = MongooseModule.forRoot('mongodb://yrr:AlyYrrAdmin123@120.79.162.189:5606/money?authSource=admin', {
  connectionName: 'money',
});

// file的mongoose配置
export const fileMongooseModuleForRoot = MongooseModule.forRoot('mongodb://yrr:AlyYrrAdmin123@120.79.162.189:5606/file?authSource=admin', {
  connectionName: 'file',
});

// blog的mongoose配置
export const blogMongooseModuleForRoot = MongooseModule.forRoot('mongodb://yrr:AlyYrrAdmin123@120.79.162.189:5606/blog?authSource=admin', {
  connectionName: 'blog',
});
