import { Controller, UseGuards, UseInterceptors, HttpCode, UploadedFile, Request, Post, Body, Put } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiHttpStatus } from 'src/common/enums/api-code.enum';
import { JwtAuthGuard } from 'src/jwt/jwt-auth.guard';
import { AliPayService } from './ali-pay.service';
import { CreateAliPayBatchDto } from './dto/create-ali-pay.dto';
import { PageAliPayDto } from './dto/page-ali-pay.dto';
import { UpdateAliPayDto } from './dto/update-ali-pay.dto';
import { UploadAliPayDto } from './dto/upload-we-chat.dto';

@Controller('ali-pay')
@ApiTags('支付宝')
@ApiBearerAuth('jwt')
@UseGuards(JwtAuthGuard)
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
    return this.aliPayService.batchSave(req.user._id, body);
  }

  @Post('find_page')
  @HttpCode(ApiHttpStatus.SUCCESS)
  @ApiOperation({ summary: '条件并分页获取支付宝账单列表' })
  findPage(@Request() req, @Body() body: PageAliPayDto) {
    return this.aliPayService.findPage(req.user._id, body);
  }

  @Put('update')
  @ApiOperation({ summary: '修改支付宝账单' })
  update(@Body() body: UpdateAliPayDto) {
    return this.aliPayService.update(body);
  }

  @Put('update_balance')
  @ApiOperation({ summary: '处理支付宝余额' })
  updateBalance(@Request() req: any) {
    return this.aliPayService.updateBalance(req.user._id);
  }

  @Put('update_balance_body')
  @ApiOperation({ summary: '处理支付宝余额宝' })
  updateBalanceBaby(@Request() req: any) {
    return this.aliPayService.updateBalanceBaby(req.user._id);
  }
}
