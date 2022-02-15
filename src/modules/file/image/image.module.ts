import { BadRequestException, Module } from '@nestjs/common';
import { ImageService } from './image.service';
import { ImageController } from './image.controller';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { MongooseModule } from '@nestjs/mongoose';
import { Image, ImageSchema } from 'src/schemas/image.schema';

const IMAGE_MONGO_MODULE = MongooseModule.forFeature([{ name: Image.name, schema: ImageSchema }]);

@Module({
  imports: [
    IMAGE_MONGO_MODULE,
    MulterModule.register({
      storage: diskStorage({
        // 配置文件上传后的文件夹路径
        destination: `./public/files/image`,
        filename: (req, file, cb) => {
          const image = ['gif', 'png', 'jpg', 'jpeg', 'bmp', 'webp'];
          const mimeType = file.mimetype.split('/')[1];
          if (image.filter((item) => item === mimeType).length <= 0) {
            return cb(new BadRequestException('文件格式错误！'), '');
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
})
export class ImageModule {}
