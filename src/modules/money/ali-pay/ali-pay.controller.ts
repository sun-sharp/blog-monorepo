import { Controller, UseGuards, UseInterceptors, HttpCode, UploadedFile, Request, Post, Body } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiHttpStatus } from 'src/common/enums/api-code.enum';
import { AliPayService } from './ali-pay.service';
import { CreateAliPayBatchDto } from './dto/create-ali-pay.dto';
import { PageAliPayDto } from './dto/page-ali-pay.dto';
import { UploadAliPayDto } from './dto/upload-we-chat.dto';

@Controller('ali-pay')
@ApiTags('支付宝')
@ApiBearerAuth('jwt')
@UseGuards(AuthGuard('jwt'))
export class AliPayController {
  constructor(private readonly aliPayService: AliPayService) {}

  @ApiOperation({ summary: '支付宝账单导入' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: UploadAliPayDto,
  })
  @UseInterceptors(FileInterceptor('file'))
  @Post('upload')
  @HttpCode(ApiHttpStatus.SUCCESS)
  upload(@UploadedFile() file: Express.Multer.File) {
    return this.aliPayService.upload(file);
  }

  @Post('batch-save')
  @HttpCode(ApiHttpStatus.SUCCESS)
  @ApiOperation({ summary: '批量创建支付宝账单' })
  batchSave(@Request() req, @Body() body: CreateAliPayBatchDto) {
    return this.aliPayService.batchSave(req.user.userId, body);
  }

  @Post('find_page')
  @HttpCode(ApiHttpStatus.SUCCESS)
  @ApiOperation({ summary: '条件并分页获取微信账单列表' })
  findPage(@Request() req, @Body() body: PageAliPayDto) {
    return this.aliPayService.findPage(req.user.userId, body);
  }

  // @Post()
  // create(@Body() createAliPayDto: CreateAliPayDto) {
  //   return this.aliPayService.create(createAliPayDto);
  // }

  // @Get()
  // findAll() {
  //   return this.aliPayService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.aliPayService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateAliPayDto: UpdateAliPayDto) {
  //   return this.aliPayService.update(+id, updateAliPayDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.aliPayService.remove(+id);
  // }
}
