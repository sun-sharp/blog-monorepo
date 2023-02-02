import { Injectable } from '@nestjs/common';
import { sumArrayToMoney, uniqueArray } from 'src/common/array';
import { ApiCode } from 'src/common/enums/api-code.enum';
import { IResponse } from 'src/interfaces/response.interface';
import { BankService } from './bank/bank.service';
import { StatisticsBankFlowDto } from './dto/statistics-bank-flow.dto';

interface IBankFlow {
  voucherNum?: number;
  startBalance: number;
  endBalance: number;
  inflowMoneyAmount: number;
  outflowMoneyAmount: number;
  voucherNo?: string;
  voucherType?: number;
  children?: IBankFlow[];
}

@Injectable()
export class MoneyService {
  response: IResponse;
  constructor(private readonly bankService: BankService) {}

  index() {
    return '金钱内容';
  }

  /**
   * @description: 统计银行数据的流动
   * @param {string} userId
   * @param {StatisticsBankFlowDto} query
   * @return {Promise<IResponse>}
   */
  public statisticsBankFlow(userId: string, query?: StatisticsBankFlowDto): Promise<IResponse> {
    return (
      Promise.resolve({ userId, query })
        .then(async ({ userId, query }) => {
          const modelAll = await this.bankService.findModelAll(userId, query.startTime, query.endTime);
          const sortModelAll = modelAll.sort((a, b) => {
            return new Date(b.tradeTime).getTime() > new Date(a.tradeTime).getTime() ? -1 : 1;
          });
          // 工商银行
          const businessArr = sortModelAll.filter((f) => f.bankType === 1);
          // 农业银行
          const agricultureArr = sortModelAll.filter((f) => f.bankType === 2);
          // 建设银行
          const buildArr = sortModelAll.filter((f) => f.bankType === 3);
          // 民生银行
          const civilArr = sortModelAll.filter((f) => f.bankType === 4);
          // 招商银行
          const attractInvestmentArr = sortModelAll.filter((f) => f.bankType === 5);
          // 获取银行数据
          const bankFlowFun = (flowArr: any[]) => {
            const bankFlow: IBankFlow = {
              voucherNum: 0,
              startBalance: 0,
              endBalance: 0,
              inflowMoneyAmount: 0,
              outflowMoneyAmount: 0,
            };
            // 判断工商数据是否为空
            if (flowArr.length > 0) {
              // 判断凭证是否是一个
              const voucherArr = uniqueArray(flowArr.map((m) => `${m.voucherType}--${m.voucherNo}`));
              const voucherNum = voucherArr.length;
              bankFlow.voucherNum = voucherNum;
              const voucherArrChildren = voucherArr.map((m) => {
                const voucherTypeM = Number(m.split('--')[0]) || 0;
                const voucherNoM = m.split('--')[1] || '';
                const item = {
                  startBalance: 0,
                  endBalance: 0,
                  inflowMoneyAmount: 0,
                  outflowMoneyAmount: 0,
                  voucherNo: voucherNoM,
                  voucherType: voucherTypeM,
                };
                const voucherFlowArr = flowArr.filter((f) => f.voucherType === voucherTypeM && f.voucherNo === voucherNoM);
                if (voucherFlowArr.length > 0) {
                  // 获取开始金额
                  const firstObjCh = voucherFlowArr[0];
                  let startBalanceNum = 0;
                  if (firstObjCh.inflowOrOutflow === 1) {
                    startBalanceNum = firstObjCh.balance - firstObjCh.moneyAmount;
                  } else if (firstObjCh.inflowOrOutflow === 2) {
                    startBalanceNum = firstObjCh.balance + firstObjCh.moneyAmount;
                  }
                  item.startBalance = Number(startBalanceNum.toFixed(2));
                  item.endBalance = voucherFlowArr[voucherFlowArr.length - 1].balance;
                  item.inflowMoneyAmount = sumArrayToMoney(
                    voucherFlowArr.filter((f) => f.inflowOrOutflow === 1),
                    'moneyAmount',
                  );
                  item.outflowMoneyAmount = sumArrayToMoney(
                    voucherFlowArr.filter((f) => f.inflowOrOutflow === 2),
                    'moneyAmount',
                  );
                }
                return item;
              });
              bankFlow.startBalance = sumArrayToMoney(voucherArrChildren, 'startBalance');
              bankFlow.endBalance = sumArrayToMoney(voucherArrChildren, 'endBalance');
              bankFlow.inflowMoneyAmount = sumArrayToMoney(voucherArrChildren, 'inflowMoneyAmount');
              bankFlow.outflowMoneyAmount = sumArrayToMoney(voucherArrChildren, 'outflowMoneyAmount');
              if (voucherNum > 1) {
                bankFlow.children = voucherArrChildren;
              }
            }
            return bankFlow;
          };
          return (this.response = {
            code: ApiCode.SUCCESS,
            result: {
              business: bankFlowFun(businessArr),
              agriculture: bankFlowFun(agricultureArr),
              build: bankFlowFun(buildArr),
              civil: bankFlowFun(civilArr),
              attractInvestment: bankFlowFun(attractInvestmentArr),
            },
            message: '获取成功！',
          });
        })
        // 返回错误
        .catch((err) => {
          console.log(err);
          return (this.response = {
            code: ApiCode.ERROR,
            message: err.message || '获取失败！',
          });
        })
    );
  }
}
