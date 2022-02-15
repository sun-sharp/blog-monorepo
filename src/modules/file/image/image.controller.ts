import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ImageService } from './image.service';
import { UploadImageDto } from './dto/upload-image.dto';
import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('image')
@ApiTags('图片')
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @ApiOperation({ summary: '单图片上传，接收 multipart/form-data 的数据' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: '单图片上传',
    type: UploadImageDto,
  })
  @UseInterceptors(FileInterceptor('image'))
  @Post('upload')
  uploadImage(@UploadedFile() image) {
    return this.imageService.uploadImage(image);
  }
}
