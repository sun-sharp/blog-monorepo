import { Controller, Post, Body, UseGuards, HttpCode, Request, UseInterceptors, UploadedFile, Put, Query } from '@nestjs/common';
import { WeChatService } from './we-chat.service';
import { CreateWeChatBatchDto, CreateWeChatDto } from './dto/create-we-chat.dto';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiHttpStatus } from 'src/common/enums/api-code.enum';
import { PageWeChatDto } from './dto/page-we-chat.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadWeChatDto } from './dto/upload-we-chat.dto';
import { UpdateWeChatDto } from './dto/update-we-chat.dto';
import { JwtAuthGuard } from 'src/jwt/jwt-auth.guard';
import { StatisticsStartEndTimeDto } from 'src/common/dto/statistics-start-end-time.dto';

@Controller('we-chat')
@ApiTags('微信')
@ApiBearerAuth('jwt')
@UseGuards(JwtAuthGuard)
export class WeChatController {
  constructor(private readonly weChatService: WeChatService) {}

  @ApiOperation({ summary: '微信账单导入' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UploadWeChatDto })
  @UseInterceptors(FileInterceptor('file'))
  @Post('upload')
  @HttpCode(ApiHttpStatus.SUCCESS)
  upload(@UploadedFile() file: UploadWeChatDto, @Body() body: UploadWeChatDto) {
    return this.weChatService.upload(file, body.startNum, body.endNum);
  }

  @Post('save')
  @HttpCode(ApiHttpStatus.SUCCESS)
  @ApiOperation({ summary: '创建微信账单' })
  save(@Request() req, @Body() body: CreateWeChatDto) {
    return this.weChatService.save(req.user._id, body);
  }

  @Post('batch-save')
  @HttpCode(ApiHttpStatus.SUCCESS)
  @ApiOperation({ summary: '批量创建微信账单' })
  batchSave(@Request() req, @Body() body: CreateWeChatBatchDto) {
    return this.weChatService.batchSave(req.user._id, body);
  }

  @Post('find_page')
  @HttpCode(ApiHttpStatus.SUCCESS)
  @ApiOperation({ summary: '条件并分页获取微信账单列表' })
  findPage(@Request() req, @Body() body: PageWeChatDto) {
    return this.weChatService.findPage(req.user._id, body);
  }

  @Put('update')
  @ApiOperation({ summary: '修改微信账单' })
  update(@Body() body: UpdateWeChatDto) {
    return this.weChatService.update(body);
  }

  @Put('update_balance')
  @ApiOperation({ summary: '处理微信余额' })
  updateBalance(@Request() req: any, @Query() query: StatisticsStartEndTimeDto) {
    return this.weChatService.updateBalance(req.user._id, query);
  }
}
