import { BadRequestException, Module } from '@nestjs/common';
import { ImageService } from './image.service';
import { ImageController } from './image.controller';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { MongooseModule } from '@nestjs/mongoose';
import { Image, ImageSchema } from 'src/schemas/file/image.schema';
import { UserModule } from 'src/modules/capital/user/user.module';
import { useCustomConfig } from 'src/config';

const IMAGE_MONGO_MODULE = MongooseModule.forFeature([{ name: Image.name, schema: ImageSchema }], 'file');

const customConfig = useCustomConfig();

@Module({
  imports: [
    UserModule,
    IMAGE_MONGO_MODULE,
    MulterModule.register({
      storage: diskStorage({
        // 配置文件上传后的文件夹路径
        destination: `${customConfig.fileLib}/public/files/image`,
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
          const filename = `${new Date().getTime()}.${file.originalname.split('.')[1]}`;
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
