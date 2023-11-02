import { BadRequestException, Module } from '@nestjs/common';
import { ImageService } from './image.service';
import { ImageController } from './image.controller';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { MongooseModule } from '@nestjs/mongoose';
import { Image, ImageSchema } from 'src/schemas/capital/image.schema';
import { UserModule } from 'src/modules/capital/user/user.module';
import { useCustomConfig } from 'src/config';
import { ArticleModule } from 'src/modules/blog/article/article.module';
import { existsSync, mkdirSync } from 'node:fs';
import { logger } from 'src/common/journal';

const customConfig = useCustomConfig();
const { staticDirPosition, staticDirName, imageRefixName, capitalDatabaseName } = customConfig;
const IMAGE_MONGO_MODULE = MongooseModule.forFeature([{ name: Image.name, schema: ImageSchema }], capitalDatabaseName);

// 判断image目录是否路径存在
const imageDir = `${staticDirPosition}${staticDirName}/image`;
const hasDir = existsSync(imageDir);
if (!hasDir) {
  // 创建image目录
  mkdirSync(imageDir);
  logger.log('创建image目录');
}

@Module({
  imports: [
    UserModule,
    ArticleModule,
    IMAGE_MONGO_MODULE,
    MulterModule.register({
      storage: diskStorage({
        // 配置文件上传后的文件夹路径
        destination: imageDir,
        filename: (req, file, cb) => {
          const image = ['gif', 'png', 'jpg', 'jpeg', 'bmp', 'webp'];
          const mimeType = file.mimetype.split('/')[1];
          const { source } = req.headers;
          if (!source || typeof source !== 'string') {
            return cb(new BadRequestException('来源不能为空或来源格式必须是字符串！'), '');
          }
          if (image.filter((item) => item === mimeType).length <= 0) {
            return cb(new BadRequestException('图片格式错误！'), '');
          }
          // 在此处自定义保存后的文件名称
          const filename = `${imageRefixName || ''}${new Date().getTime()}.${file.originalname.split('.')[1]}`;
          return cb(null, filename);
        },
      }),
    }),
  ],
  controllers: [ImageController],
  providers: [ImageService],
  exports: [ImageService],
})
export class ImageModule {}
