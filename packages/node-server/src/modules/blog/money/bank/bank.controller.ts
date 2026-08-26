import { Controller, UseInterceptors, HttpCode, UploadedFile, Post, Request, UseGuards, Body, Put, Delete, Param, Res, Get, Query } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiHttpStatus } from 'src/common/enums/api-code.enum';
import { JwtAuthGuard } from 'src/jwt/jwt-auth.guard';
import { BankService } from './bank.service';
import { CreateBankBatchDto } from './dto/create-bank.dto';
import { PageBankDto } from './dto/page-bank.dto';
import { batchRemoveDto } from './dto/remove-bank.dto';
import { UpdateBankDto } from './dto/update-bank.dto';
import { UploadBankDto } from './dto/upload-bank.dto';
import { Response } from 'express';

@Controller('bank')
@ApiTags('银行')
@ApiBearerAuth('jwt')
@UseGuards(JwtAuthGuard)
export class BankController {
  constructor(private readonly bankService: BankService) {}

  @ApiOperation({ summary: '银行账单导入' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: UploadBankDto,
  })
  @UseInterceptors(FileInterceptor('file'))
  @Post('upload')
  @HttpCode(ApiHttpStatus.SUCCESS)
  upload(@UploadedFile() file: UploadBankDto, @Body('bankType') bankType: number, @Query('bankType') queryBankType: number) {
    return this.bankService.upload(file, bankType || queryBankType);
  }

  @Post('batch-save')
  @HttpCode(ApiHttpStatus.SUCCESS)
  @ApiOperation({ summary: '批量创建银行账单' })
  batchSave(@Request() req, @Body() body: CreateBankBatchDto) {
    return this.bankService.batchSave(req.user._id, body);
  }

  @Post('find_page')
  @HttpCode(ApiHttpStatus.SUCCESS)
  @ApiOperation({ summary: '条件并分页获取银行账单列表' })
  findPage(@Request() req, @Body() body: PageBankDto) {
    return this.bankService.findPage(req.user._id, body);
  }

  @Put('update')
  @ApiOperation({ summary: '修改银行账单' })
  update(@Body() body: UpdateBankDto) {
    return this.bankService.update(body);
  }

  @Delete('batch_remove')
  @ApiOperation({ summary: '批量删除银行账单' })
  batchRemove(@Body() body: batchRemoveDto) {
    return this.bankService.batchRemove(body);
  }

  @Get('download')
  @ApiOperation({ summary: '下载银行账单模版文件' })
  downloadFile(@Res() res: Response, @Query('bankType') bankType: number) {
    this.bankService.downloadFile(res, bankType);
  }

  @Delete('remove/:bankId')
  @ApiOperation({ summary: '删除银行账单' })
  remove(@Param('bankId') bankId: string) {
    return this.bankService.remove(bankId);
  }
}
