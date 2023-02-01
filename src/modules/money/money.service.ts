import { Injectable } from '@nestjs/common';
import { ApiCode } from 'src/common/enums/api-code.enum';
import { IResponse } from 'src/interfaces/response.interface';
import { BankService } from './bank/bank.service';
import { StatisticsBankFlowDto } from './dto/statistics-bank-flow.dto';

@Injectable()
export class MoneyService {
  response: IResponse;
  constructor(private readonly bankService: BankService) {}

  index() {
    return '金钱内容';
  }

  /**
   * @description: 统计银行数据的流动
   * @return {Promise<IResponse>}
   */
  public statisticsBankFlow(query?: StatisticsBankFlowDto): Promise<IResponse> {
    return (
      Promise.resolve(query)
        .then(async (query) => {
          const modelAll = await this.bankService.findModelAll(query.startTime, query.endTime);
          console.log(modelAll);

          return (this.response = {
            code: ApiCode.SUCCESS,
            message: '删除成功！',
          });
        })
        // 返回错误
        .catch((err) => {
          return (this.response = {
            code: ApiCode.ERROR,
            message: err.message || '删除失败！',
          });
        })
    );
  }
}
