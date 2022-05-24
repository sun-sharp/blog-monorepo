import { Controller, Get } from '@nestjs/common';
import { MoneyService } from './money.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

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
}
