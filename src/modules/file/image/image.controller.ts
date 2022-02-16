import { Body, Controller, Delete, Get, HttpCode, Param, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ImageService } from './image.service';
import { UploadImageDto } from './dto/upload-image.dto';
import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiHttpStatus } from 'src/common/enums/api-code.enum';
import { PageImageDto } from './dto/page-image.dto';

@Controller('image')
@ApiTags('图片')
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @ApiOperation({ summary: '单图片上传，接收 multipart/form-data 的数据' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: UploadImageDto,
  })
  @UseInterceptors(FileInterceptor('image'))
  @Post('upload')
  @HttpCode(ApiHttpStatus.SUCCESS)
  uploadImage(@Body() body: UploadImageDto, @UploadedFile() image) {
    return this.imageService.uploadImage(image, body);
  }

  @ApiOperation({ summary: '获取图片目录' })
  @Get('public')
  getPublic() {
    return this.imageService.getPublic();
  }

  @ApiOperation({ summary: '获取图片全部列表数据' })
  @Get('find_all')
  findAll() {
    return this.imageService.findAll();
  }

  @ApiOperation({ summary: '条件并分页获取图片数据列表' })
  @Post('find_page')
  findPage(@Body() pageImageDto: PageImageDto) {
    return this.imageService.findPage(pageImageDto);
  }

  @Delete('remove_public/:fileName')
  @ApiOperation({ summary: '删除图片目录下的图片' })
  removePublic(@Param('fileName') fileName: string) {
    return this.imageService.removePublic(fileName);
  }

  @Delete('remove_data/:imageId')
  @ApiOperation({ summary: '删除图片下的数据' })
  removeData(@Param('imageId') imageId: string) {
    return this.imageService.removeData(imageId);
  }

  @Delete('remove_public_data/:imageId')
  @ApiOperation({ summary: '删除 图片目录下的图片 和 图片下的数据' })
  removePublicAndData(@Param('imageId') imageId: string) {
    return this.imageService.removePublicAndData(imageId);
  }
}
