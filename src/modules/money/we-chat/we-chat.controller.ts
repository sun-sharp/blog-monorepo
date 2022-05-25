import { Controller, Post, Body, UseGuards, HttpCode, Request, UseInterceptors, UploadedFile } from '@nestjs/common';
import { WeChatService } from './we-chat.service';
import { CreateWeChatBatchDto, CreateWeChatDto } from './dto/create-we-chat.dto';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { ApiHttpStatus } from 'src/common/enums/api-code.enum';
import { PageWeChatDto } from './dto/page-we-chat.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadWeChatDto } from './dto/upload-we-chat.dto';

@Controller('we-chat')
@ApiTags('微信')
@ApiBearerAuth('jwt')
@UseGuards(AuthGuard('jwt'))
export class WeChatController {
  constructor(private readonly weChatService: WeChatService) {}

  @ApiOperation({ summary: '微信账单导入' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: UploadWeChatDto,
  })
  @UseInterceptors(FileInterceptor('file'))
  @Post('upload')
  @HttpCode(ApiHttpStatus.SUCCESS)
  upload(@UploadedFile() file: Express.Multer.File) {
    return this.weChatService.upload(file);
  }

  @Post('save')
  @HttpCode(ApiHttpStatus.SUCCESS)
  @ApiOperation({ summary: '创建微信账单' })
  save(@Request() req, @Body() body: CreateWeChatDto) {
    return this.weChatService.save(req.user.userId, body);
  }

  @Post('batch-save')
  @HttpCode(ApiHttpStatus.SUCCESS)
  @ApiOperation({ summary: '批量创建微信账单' })
  batchSave(@Request() req, @Body() body: CreateWeChatBatchDto) {
    return this.weChatService.batchSave(req.user.userId, body);
  }

  @Post('find_page')
  @HttpCode(ApiHttpStatus.SUCCESS)
  @ApiOperation({ summary: '条件并分页获取微信账单列表' })
  findPage(@Request() req, @Body() body: PageWeChatDto) {
    return this.weChatService.findPage(req.user.userId, body);
  }

  // @Get()
  // findAll() {
  //   return this.weChatService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.weChatService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateWeChatDto: UpdateWeChatDto) {
  //   return this.weChatService.update(+id, updateWeChatDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.weChatService.remove(+id);
  // }
}
