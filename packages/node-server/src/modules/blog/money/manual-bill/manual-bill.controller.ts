import { Controller, Post, Body, UseGuards, HttpCode, Request, Put, Delete, Param, Get } from '@nestjs/common';
import { ManualBillService } from './manual-bill.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiHttpStatus } from 'src/common/enums/api-code.enum';
import { JwtAuthGuard } from 'src/jwt/jwt-auth.guard';
import { CreateManualBillDto } from './dto/create-manual-bill.dto';
import { PageManualBillDto } from './dto/page-manual-bill.dto';
import { UpdateManualBillDto } from './dto/update-manual-bill.dto';

@Controller('manual-bill')
@ApiTags('手写账单')
@ApiBearerAuth('jwt')
@UseGuards(JwtAuthGuard)
export class ManualBillController {
  constructor(private readonly manualBillService: ManualBillService) {}

  @Post('save')
  @HttpCode(ApiHttpStatus.SUCCESS)
  @ApiOperation({ summary: '创建手写账单' })
  save(@Request() req: any, @Body() body: CreateManualBillDto) {
    return this.manualBillService.save(req.user._id, body);
  }

  @Post('find_page')
  @HttpCode(ApiHttpStatus.SUCCESS)
  @ApiOperation({ summary: '条件并分页获取手写账单列表' })
  findPage(@Request() req: any, @Body() body: PageManualBillDto) {
    return this.manualBillService.findPage(req.user._id, body);
  }

  @Get('one/:manualBillId')
  @ApiOperation({ summary: '查询手写账单详情' })
  findOne(@Param('manualBillId') manualBillId: string) {
    return this.manualBillService.findOne(manualBillId);
  }

  @Put('update')
  @ApiOperation({ summary: '修改手写账单' })
  update(@Body() body: UpdateManualBillDto) {
    return this.manualBillService.update(body);
  }

  @Delete('remove/:manualBillId')
  @ApiOperation({ summary: '删除手写账单' })
  remove(@Param('manualBillId') manualBillId: string) {
    return this.manualBillService.remove(manualBillId);
  }
}
