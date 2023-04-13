import { Injectable } from '@nestjs/common';
import { groupArray, sumArrayToMoney, uniqueArray } from 'src/common/array';
import { ApiCode } from 'src/common/enums/api-code.enum';
import { IResponse } from 'src/interfaces/response.interface';
import { AliPayService } from './ali-pay/ali-pay.service';
import { BankService } from './bank/bank.service';
import { StatisticsStartEndTimeDto } from './dto/statistics-start-end-time.dto';
import { WeChatService } from './we-chat/we-chat.service';
import { billTypeEnum } from 'src/common/enums/money.enum';
import { CategoryService } from '../capital/category/category.service';
import { categoryTypeEnum } from 'src/common/enums/category.enum';

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
  constructor(
    private readonly bankService: BankService,
    private readonly weChatService: WeChatService,
    private readonly aliPayService: AliPayService,
    private readonly categoryService: CategoryService,
  ) {}

  index() {
    return '金钱内容';
  }

  /**
   * @description: 统计银行数据的流动
   * @param {string} userId
   * @param {StatisticsStartEndTimeDto} query
   * @return {Promise<IResponse>}
   */
  public statisticsBankFlow(userId: string, query?: StatisticsStartEndTimeDto): Promise<IResponse> {
    return (
      Promise.resolve({ userId, query })
        .then(async ({ userId, query }) => {
          // 查询银行账单
          const bankModelAll = await this.bankService.findModelAll(userId, query.startTime, query.endTime);
          // 工商银行
          const businessArr = bankModelAll.filter((f) => f.bankType === 1);
          // 农业银行
          const agricultureArr = bankModelAll.filter((f) => f.bankType === 2);
          // 建设银行
          const buildArr = bankModelAll.filter((f) => f.bankType === 3);
          // 民生银行
          const civilArr = bankModelAll.filter((f) => f.bankType === 4);
          // 招商银行
          const attractInvestmentArr = bankModelAll.filter((f) => f.bankType === 5);
          // 获取银行数据
          const bankFlowFun = (flowArr: any[]) => {
            const bankFlow: IBankFlow = {
              voucherNum: 0,
              startBalance: 0,
              endBalance: 0,
              inflowMoneyAmount: 0,
              outflowMoneyAmount: 0,
            };
            // 判断数据是否为空
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
          return (this.response = {
            code: ApiCode.ERROR,
            message: err.message || '获取失败！',
          });
        })
    );
  }

  /**
   * @description: 统计各个的方式的余额
   * @param {string} userId
   * @return {*}
   */
  public statisticsMoneyBalance(userId: string): Promise<IResponse> {
    return (
      Promise.resolve()
        .then(async () => {
          // 微信零钱
          const weChat = await this.weChatService.findLastOneBalance(userId);
          // 查询银行账单
          const bankModelAll = await this.bankService.findModelAll(userId);
          // 工商银行
          const businessArr = bankModelAll.filter((f) => f.bankType === 1);
          // 农业银行
          const agricultureArr = bankModelAll.filter((f) => f.bankType === 2);
          // 建设银行
          const buildArr = bankModelAll.filter((f) => f.bankType === 3);
          // 民生银行
          const civilArr = bankModelAll.filter((f) => f.bankType === 4);
          // 招商银行
          const attractInvestmentArr = bankModelAll.filter((f) => f.bankType === 5);
          // 获取银行的余额
          const bankBalanceFun = (balanceArr: any[]) => {
            let bankBalance = 0;
            // 判断数据是否为空
            if (balanceArr.length > 0) {
              // 判断凭证是否是一个
              const voucherArr = uniqueArray(balanceArr.map((m) => `${m.voucherType}--${m.voucherNo}`));
              const voucherArrChildren = voucherArr.map((m) => {
                const voucherTypeM = Number(m.split('--')[0]) || 0;
                const voucherNoM = m.split('--')[1] || '';
                let voucherBalance = 0;
                const voucherBalanceArr = balanceArr.filter((f) => f.voucherType === voucherTypeM && f.voucherNo === voucherNoM);
                if (voucherBalanceArr.length > 0) {
                  voucherBalance = voucherBalanceArr[voucherBalanceArr.length - 1].balance;
                }
                return voucherBalance;
              });
              bankBalance = sumArrayToMoney(voucherArrChildren);
            }
            return bankBalance;
          };
          // 支付宝余额
          const aliPayBalance = await this.aliPayService.findLastOneBalance(userId, 'balance');
          // 支付宝余额宝
          const aliPayBalanceBaby = await this.aliPayService.findLastOneBalance(userId, 'balanceBaby');
          return (this.response = {
            code: ApiCode.SUCCESS,
            result: {
              weChatBalance: weChat.length > 0 ? weChat[0].balance : 0,
              aliPayBalance: aliPayBalance.length > 0 ? aliPayBalance[0].balance : 0,
              aliPayBalanceBaby: aliPayBalanceBaby.length > 0 ? aliPayBalanceBaby[0].balanceBaby : 0,
              businessBank: bankBalanceFun(businessArr),
              agricultureBank: bankBalanceFun(agricultureArr),
              buildBank: bankBalanceFun(buildArr),
              civilBank: bankBalanceFun(civilArr),
              attractInvestmentBank: bankBalanceFun(attractInvestmentArr),
            },
            message: '获取成功！',
          });
        })
        // 返回错误
        .catch((err) => {
          return (this.response = {
            code: ApiCode.ERROR,
            message: err.message || '获取失败！',
          });
        })
    );
  }

  /**
   * @description: 统计某时间范围内的方式流入/流出的金额
   * @param {string} userId
   * @param {StatisticsStartEndTimeDto} query
   * @return {Promise<IResponse>}
   */
  public statisticsInflowOrOutflowMoney(userId: string, query?: StatisticsStartEndTimeDto): Promise<IResponse> {
    return (
      Promise.resolve({ userId, query })
        .then(async ({ userId, query }) => {
          // 获取账单的类型分类
          const billTypeOptions = await this.categoryService.findByType(categoryTypeEnum.moneyBillType);
          // 查询某时间范围内的银行账单
          const bankModelAll = await this.bankService.findModelAll(userId, query.startTime, query.endTime);
          // 现金流入/流出的金额
          const transitMoneyArr = bankModelAll
            .filter((f) => [billTypeEnum.cashPartTransit, billTypeEnum.cashTransit].includes(f.bankBillType))
            .map((m) => {
              if (m.inflowOrOutflow === 1) {
                return 0 - m.moneyAmount;
              } else if (m.inflowOrOutflow === 2) {
                return m.moneyAmount;
              } else {
                return 0;
              }
            });
          // 现金花费方式的
          const spendMoneyArr = bankModelAll
            .filter((f) => [billTypeEnum.cashSpend].includes(f.bankBillType))
            .map((m) => {
              if (m.inflowOrOutflow === 1) {
                return 0 - m.moneyAmount;
              } else if (m.inflowOrOutflow === 2) {
                return m.moneyAmount;
              } else {
                return 0;
              }
            });
          // 银行现金流出的
          const transitMoney = sumArrayToMoney(transitMoneyArr);
          const bankCashOutflow = (transitMoney > 0 ? transitMoney : 0) + sumArrayToMoney(spendMoneyArr);
          // 银行现金流入的
          const bankCashInflow = transitMoney < 0 ? 0 - transitMoney : 0;
          //* 银行除现金外，其它方式 */
          const bankOtherMoneyArr = bankModelAll.filter(
            (f) => ![billTypeEnum.cashSpend, billTypeEnum.cashPartTransit, billTypeEnum.cashTransit].includes(f.bankBillType),
          );
          //* 查询某时间范围内的微信账单 */
          const weChatModelAll = await this.weChatService.findModelAll(userId, query.startTime, query.endTime);
          //* 查询某时间范围内的支付宝账单 */
          const aliPayModelAll = await this.aliPayService.findModelAll(userId, query.startTime, query.endTime);
          const aliPayAndWeChatArr = groupArray(
            weChatModelAll
              .map((m) => ({
                billType: m.billType,
                inflowOrOutflow: m.inflowOrOutflow,
                moneyAmount: m.moneyAmount,
              }))
              .concat(
                aliPayModelAll.map((m) => ({
                  billType: m.billType,
                  inflowOrOutflow: m.inflowOrOutflow,
                  moneyAmount: m.moneyAmount,
                })),
              )
              .concat(
                bankOtherMoneyArr.map((m) => ({
                  billType: m.bankBillType,
                  inflowOrOutflow: m.inflowOrOutflow,
                  moneyAmount: m.moneyAmount,
                })),
              ),
            'children',
            ['billType'],
          );
          const aliPayAndWeChatInflowOrOutflowArr = aliPayAndWeChatArr.map((gr: { billType: any; children: any[] }) => {
            const sumMoneyArr = gr.children.map((m: { inflowOrOutflow: number; moneyAmount: number }) => {
              if (m.inflowOrOutflow === 1) {
                return 0 - m.moneyAmount;
              } else if (m.inflowOrOutflow === 2) {
                return m.moneyAmount;
              } else {
                return 0;
              }
            });
            const sumMoney = sumArrayToMoney(sumMoneyArr);
            const billTypeFind = billTypeOptions.find((f) => f.value === gr.billType);
            const billTypeName = billTypeFind ? billTypeFind.label : String(gr.billType);
            return {
              name: billTypeName,
              billType: gr.billType,
              outflowMoney: sumMoney > 0 ? sumMoney : 0,
              inflowMoney: sumMoney < 0 ? 0 - sumMoney : 0,
            };
          });
          const aliPayAndWeChatOutflowArr = aliPayAndWeChatInflowOrOutflowArr
            .map((m: { name: string; outflowMoney: number }) => ({
              name: m.name,
              money: m.outflowMoney,
            }))
            .filter((f: { money: number }) => f.money !== 0);
          const bankCashName = '银行现金';
          // 汇总流出的数据
          const outflowChart = (bankCashOutflow > 0 ? [{ name: bankCashName, money: bankCashOutflow }] : []).concat(aliPayAndWeChatOutflowArr);
          const outflowSumTotal = sumArrayToMoney(
            aliPayAndWeChatInflowOrOutflowArr
              .filter(
                (f: { billType: number }) =>
                  ![
                    billTypeEnum.aliPayBalanceBabyRecharge,
                    billTypeEnum.withdrawBusiness,
                    billTypeEnum.withdrawAgriculture,
                    billTypeEnum.withdrawBuild,
                  ].includes(f.billType),
              )
              .map((m: { outflowMoney: number }) => m.outflowMoney)
              .concat([bankCashOutflow]),
          );
          // 汇总流入的数据
          const aliPayAndWeChatInflowArr = aliPayAndWeChatInflowOrOutflowArr
            .map((m: { name: string; inflowMoney: number }) => ({
              name: m.name,
              money: m.inflowMoney,
            }))
            .filter((f: { money: number }) => f.money !== 0);
          const inflowChart = (bankCashInflow > 0 ? [{ name: bankCashName, money: bankCashInflow }] : []).concat(aliPayAndWeChatInflowArr);
          const inflowSumTotal = sumArrayToMoney(
            aliPayAndWeChatInflowOrOutflowArr
              .filter((f: { billType: number }) => ![billTypeEnum.weChatChangeRecharge, billTypeEnum.aliPayBalanceRecharge].includes(f.billType))
              .map((m: { inflowMoney: number }) => m.inflowMoney)
              .concat([bankCashInflow]),
          );
          return (this.response = {
            code: ApiCode.SUCCESS,
            result: {
              outflowSumTotal,
              outflowChart,
              inflowSumTotal,
              inflowChart,
            },
            message: '获取成功！',
          });
        })
        // 返回错误
        .catch((err) => {
          return (this.response = {
            code: ApiCode.ERROR,
            message: err.message || '获取失败！',
          });
        })
    );
  }
}
