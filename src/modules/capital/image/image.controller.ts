import { Body, Controller, Delete, Get, HttpCode, Param, Post, Req, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ImageService } from './image.service';
import { UploadImageDto } from './dto/upload-image.dto';
import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiHttpStatus } from 'src/common/enums/api-code.enum';
import { PageImageDto } from './dto/page-image.dto';
import { RemoveDataAllImageDto, RemovePublicAllImageDto, RemovePublicAndDataAllImageDto } from './dto/remove-all-image.dto';
import { Request } from 'express';

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
  uploadImage(@UploadedFile() image, @Req() req: Request) {
    return this.imageService.uploadImage(image, req.headers.source);
  }

  @ApiOperation({ summary: '获取图片目录' })
  @Get('public')
  getPublic() {
    return this.imageService.getPublic();
  }

  @ApiOperation({ summary: '查询只有图片文件没有数据的文件' })
  @Get('only_public')
  getOnlyPublic() {
    return this.imageService.getOnlyPublic();
  }

  @ApiOperation({ summary: '查询未使用的图片' })
  @Get('not_use')
  getOntUse() {
    return this.imageService.getOntUse();
  }

  @ApiOperation({ summary: '获取图片全部列表数据' })
  @Get('find_all')
  findAll() {
    return this.imageService.findAll();
  }

  @ApiOperation({ summary: '条件并分页获取图片数据列表' })
  @Post('find_page')
  @HttpCode(ApiHttpStatus.SUCCESS)
  findPage(@Body() pageImageDto: PageImageDto) {
    return this.imageService.findPage(pageImageDto);
  }

  @Delete('remove_public/:fileName')
  @ApiOperation({ summary: '删除图片目录下的图片' })
  removePublic(@Param('fileName') fileName: string) {
    return this.imageService.removePublic(fileName);
  }

  @Delete('remove_public_all')
  @ApiOperation({ summary: '批量删除图片目录下的图片' })
  removePublicAll(@Body() removePublicAllImageDto: RemovePublicAllImageDto) {
    return this.imageService.removePublicAll(removePublicAllImageDto);
  }

  @Delete('remove_data/:imageId')
  @ApiOperation({ summary: '删除图片下的数据' })
  removeData(@Param('imageId') imageId: string) {
    return this.imageService.removeData(imageId);
  }

  @Delete('remove_data/:imageId')
  @ApiOperation({ summary: '批量删除图片下的数据' })
  removeDataAll(@Body() removeDataAllImageDto: RemoveDataAllImageDto) {
    return this.imageService.removeDataAll(removeDataAllImageDto);
  }

  @Delete('remove_public_data/:imageId')
  @ApiOperation({ summary: '删除 图片目录下的图片 和 图片下的数据' })
  removePublicAndData(@Param('imageId') imageId: string) {
    return this.imageService.removePublicAndData(imageId);
  }

  @Delete('remove_public_data_all')
  @ApiOperation({ summary: '批量删除 图片目录下的图片 和 图片下的数据' })
  removePublicAndDataAll(@Body() removePublicAndDataAllImageDto: RemovePublicAndDataAllImageDto) {
    return this.imageService.removePublicAndDataAll(removePublicAndDataAllImageDto);
  }
}
