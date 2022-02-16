import { Controller, Get } from '@nestjs/common';
import { FileService } from './file.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('file')
@ApiTags('文件')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Get()
  @ApiOperation({
    summary: '文件内容',
  })
  index() {
    return this.fileService.index();
  }
}
