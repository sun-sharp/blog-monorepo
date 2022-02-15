import { Module } from '@nestjs/common';
import { FileService } from './file.service';
import { FileController } from './file.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ImageModule } from './image/image.module';
import { RouterModule } from '@nestjs/core';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://yrr:AlyYrrAdmin123@120.79.162.189:5606/file?authSource=admin'),
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
