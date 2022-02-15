import { Controller, Post, Body, HttpCode } from '@nestjs/common';
import { FileService } from './file.service';
import { CreateFileDto } from './dto/create-file.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiHttpStatus } from 'src/common/enums/api-code.enum';

@Controller('file')
@ApiTags('文件')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post('upload_image')
  @HttpCode(ApiHttpStatus.SUCCESS)
  @ApiOperation({
    summary: '用户登录',
  })
  userLogin(@Body() loginUserDto: CreateFileDto) {
    return this.fileService.create(loginUserDto);
  }
}
