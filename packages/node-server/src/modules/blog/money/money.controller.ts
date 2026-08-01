import { Controller, Get, Post, Put, Body, Param, Query, Request, UseGuards, HttpCode } from '@nestjs/common';
import { MoneyService } from './money.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiHttpStatus } from 'src/common/enums/api-code.enum';
import { JwtAuthGuard } from 'src/jwt/jwt-auth.guard';
import { StatisticsStartEndTimeDto } from 'src/common/dto/statistics-start-end-time.dto';
import { PageAggregateBillDto } from './dto/page-aggregate-bill.dto';
import { UpdateAggregateBillDto } from './dto/update-aggregate-bill.dto';

@Controller('money')
@ApiTags('金钱')
export class MoneyController {
  constructor(private readonly moneyService: MoneyService) {}

  @Get()
  @ApiOperation({
    summary: '金钱内容',
  })
  index() {
    return this.moneyService.index();
  }

  @Post('find_aggregate_page')
  @HttpCode(ApiHttpStatus.SUCCESS)
  @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '三表聚合分页查询账单列表' })
  findAggregatePage(@Request() req: any, @Body() body: PageAggregateBillDto) {
    return this.moneyService.findAggregatePage(req.user._id, body);
  }

  @Get('find_aggregate_one/:source/:billId')
  @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '三表聚合查询单条账单详情' })
  findAggregateOne(@Param('source') source: string, @Param('billId') billId: string) {
    return this.moneyService.findAggregateOne(source, billId);
  }

  @Put('update_aggregate')
  @HttpCode(ApiHttpStatus.SUCCESS)
  @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '三表聚合修改账单' })
  updateAggregate(@Body() body: UpdateAggregateBillDto) {
    return this.moneyService.updateAggregate(body);
  }

  @Get('statistics_bank_flow')
  @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '统计银行数据的流动' })
  statisticsBankFlow(@Request() req: any, @Query() query: StatisticsStartEndTimeDto) {
    return this.moneyService.statisticsBankFlow(req.user._id, query);
  }

  @Get('statistics_money_balance')
  @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '统计各个的方式的余额' })
  statisticsMoneyBalance(@Request() req: any) {
    return this.moneyService.statisticsMoneyBalance(req.user._id);
  }

  @Get('statistics_inflow_or_outflow_money')
  @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '统计某时间范围内的方式流入/流出的金额' })
  statisticsInflowOrOutflowMoney(@Request() req: any, @Query() query: StatisticsStartEndTimeDto) {
    return this.moneyService.statisticsInflowOrOutflowMoney(req.user._id, query);
  }
}
