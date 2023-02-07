import { Controller, Get, Query, Request, UseGuards } from '@nestjs/common';
import { MoneyService } from './money.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/jwt/jwt-auth.guard';
import { StatisticsBankFlowDto } from './dto/statistics-bank-flow.dto';

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
  statisticsBankFlow(@Request() req: any, @Query() query: StatisticsBankFlowDto) {
    return this.moneyService.statisticsBankFlow(req.user._id, query);
  }

  // @Get('statistics_money_balance')
  // @ApiBearerAuth('jwt')
  // @UseGuards(JwtAuthGuard)
  // @ApiOperation({ summary: '统计各个的方式的余额' })
  // statisticsBankBalance(@Request() req, @Query() query: StatisticsBankFlowDto) {
  //   return this.moneyService.statisticsBankFlow(req.user._id, query);
  // }
}
