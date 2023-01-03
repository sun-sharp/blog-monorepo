import { Module } from '@nestjs/common';
import { FileService } from './file.service';
import { FileController } from './file.controller';
import { ImageModule } from './image/image.module';
import { RouterModule } from '@nestjs/core';
import { fileMongooseModuleForRoot } from 'src/common/constant/mongoose';

@Module({
  imports: [
    fileMongooseModuleForRoot,
    ImageModule,
    RouterModule.register([
      {
        path: 'file',
        children: [
          {
            path: '/',
            module: ImageModule,
          },
        ],
      },
    ]),
  ],
  controllers: [FileController],
  providers: [FileService],
})
export class FileModule {}
