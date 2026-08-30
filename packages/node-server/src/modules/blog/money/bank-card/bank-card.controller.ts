import { Controller, Post, Body, UseGuards, HttpCode, Request, Put, Delete, Param, Get } from '@nestjs/common';
import { BankCardService } from './bank-card.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiHttpStatus } from 'src/common/enums/api-code.enum';
import { JwtAuthGuard } from 'src/jwt/jwt-auth.guard';
import { CreateBankCardDto } from './dto/create-bank-card.dto';
import { PageBankCardDto } from './dto/page-bank-card.dto';
import { UpdateBankCardDto } from './dto/update-bank-card.dto';

@Controller('bank-card')
@ApiTags('银行卡片')
@ApiBearerAuth('jwt')
@UseGuards(JwtAuthGuard)
export class BankCardController {
  constructor(private readonly bankCardService: BankCardService) {}

  @Post('save')
  @HttpCode(ApiHttpStatus.SUCCESS)
  @ApiOperation({ summary: '创建银行卡片' })
  save(@Request() req: any, @Body() body: CreateBankCardDto) {
    return this.bankCardService.save(req.user._id, body);
  }

  @Post('find_page')
  @HttpCode(ApiHttpStatus.SUCCESS)
  @ApiOperation({ summary: '条件并分页获取银行卡片列表' })
  findPage(@Request() req: any, @Body() body: PageBankCardDto) {
    return this.bankCardService.findPage(req.user._id, body);
  }

  @Get('one/:bankCardId')
  @ApiOperation({ summary: '查询银行卡片详情' })
  findOne(@Param('bankCardId') bankCardId: string) {
    return this.bankCardService.findOne(bankCardId);
  }

  @Put('update')
  @ApiOperation({ summary: '修改银行卡片' })
  update(@Body() body: UpdateBankCardDto) {
    return this.bankCardService.update(body);
  }

  @Delete('remove/:bankCardId')
  @ApiOperation({ summary: '删除银行卡片' })
  remove(@Param('bankCardId') bankCardId: string) {
    return this.bankCardService.remove(bankCardId);
  }
}