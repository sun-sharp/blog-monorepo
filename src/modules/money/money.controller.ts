import { Controller, Get, Query, Request, UseGuards } from '@nestjs/common';
import { MoneyService } from './money.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/jwt/jwt-auth.guard';
import { StatisticsStartEndTimeDto } from './dto/statistics-start-end-time.dto';

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

  @Get('statistics_flow_out_money')
  @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '统计某时间范围内的方式支出的金额' })
  statisticsFlowOutMoney(@Request() req: any, @Query() query: StatisticsStartEndTimeDto) {
    return this.moneyService.statisticsFlowOutMoney(req.user._id, query);
  }
}
