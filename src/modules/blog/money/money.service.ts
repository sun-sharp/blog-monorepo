import { Injectable } from '@nestjs/common';
import { groupArray, sumArrayToMoney, uniqueArray } from 'src/common/array';
import { ApiCode } from 'src/common/enums/api-code.enum';
import { AliPayService } from './ali-pay/ali-pay.service';
import { BankService } from './bank/bank.service';
import { StatisticsStartEndTimeDto } from './dto/statistics-start-end-time.dto';
import { WeChatService } from './we-chat/we-chat.service';
import { billTypeEnum } from 'src/common/enums/money.enum';
import { categoryTypeEnum } from 'src/common/enums/category.enum';
import { CategoryService } from 'src/modules/capital/category/category.service';
import { ApiAliPayAndWeChatChild, ApiBankFlow, ApiBankFlowResult, ApiInflowOrOutflowMoneyResult, ApiMoneyBalanceResult } from 'types/blog/money';
import { ApiBank } from 'types/blog/money/bank';
import { IResponse } from 'types/common';
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { logger } from 'src/common/journal';
import { createStoreDir } from 'src/common/fs-mkdir';
import { storeDirStr } from 'src/common/constant/config';
import { useCustomConfig } from 'src/config';

const customConfig = useCustomConfig();
const { blogDatabaseName } = customConfig;

@Injectable()
export class MoneyService {
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
          const bankFlowFun = (flowArr: ApiBank[]) => {
            const bankFlow: ApiBankFlow = {
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
          const result: ApiBankFlowResult[] = [
            {
              name: '工商银行',
              ...bankFlowFun(businessArr),
            },
            {
              name: '农业银行',
              ...bankFlowFun(agricultureArr),
            },
            {
              name: '建设银行',
              ...bankFlowFun(buildArr),
            },
            {
              name: '民生银行',
              ...bankFlowFun(civilArr),
            },
            {
              name: '招商银行',
              ...bankFlowFun(attractInvestmentArr),
            },
          ];
          return {
            code: ApiCode.SUCCESS,
            result,
            message: '获取成功！',
          };
        })
        // 返回错误
        .catch((err) => {
          logger.error(`统计银行数据的流动 失败! ${err}`);
          return {
            code: ApiCode.ERROR,
            message: err || '获取失败！',
          };
        })
    );
  }

  /**
   * @description: 统计各个的方式的余额
   * @param {string} userId
   * @return {Promise<IResponse>}
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
          const bankBalanceFun = (balanceArr: ApiBank[]): number => {
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
          const result: ApiMoneyBalanceResult[] = [
            {
              name: '微信零钱',
              value: weChat.length > 0 ? weChat[0].balance : 0,
            },
            {
              name: '支付宝余额',
              value: aliPayBalance.length > 0 ? aliPayBalance[0].balance : 0,
            },
            {
              name: '支付宝余额宝',
              value: aliPayBalanceBaby.length > 0 ? aliPayBalanceBaby[0].balanceBaby : 0,
            },
            {
              name: '工商银行',
              value: bankBalanceFun(businessArr),
            },
            {
              name: '农业银行',
              value: bankBalanceFun(agricultureArr),
            },
            {
              name: '建设银行',
              value: bankBalanceFun(buildArr),
            },
            {
              name: '民生银行',
              value: bankBalanceFun(civilArr),
            },
            {
              name: '招商银行',
              value: bankBalanceFun(attractInvestmentArr),
            },
          ];
          return {
            code: ApiCode.SUCCESS,
            result,
            message: '获取成功！',
          };
        })
        // 返回错误
        .catch((err) => {
          logger.error(`统计各个的方式的余额 失败! ${err}`);
          return {
            code: ApiCode.ERROR,
            message: err || '获取失败！',
          };
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
          //* 现金流入/流出的金额 */
          const bankCashName = '银行现金';
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
          const aliPayAndWeChatInflowOrOutflowArr = aliPayAndWeChatArr.map((gr: { billType: number; children: ApiAliPayAndWeChatChild[] }) => {
            const sumMoneyArr = gr.children.map((m) => {
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
          // 汇总流出的数据
          const outflowFilter = aliPayAndWeChatInflowOrOutflowArr.filter(
            (f: { billType: number }) =>
              ![
                billTypeEnum.aliPayBalanceBabyRecharge,
                billTypeEnum.withdrawBusiness,
                billTypeEnum.withdrawAgriculture,
                billTypeEnum.withdrawBuild,
                billTypeEnum.bankAliPayUse,
                billTypeEnum.bankWeChatUse,
              ].includes(f.billType),
          );
          const outflowMoneyArr = outflowFilter
            .map((m: { name: string; outflowMoney: number }) => ({
              name: m.name,
              money: m.outflowMoney,
            }))
            .filter((f: { money: number }) => f.money !== 0);
          const outflowChart = (bankCashOutflow > 0 ? [{ name: bankCashName, money: bankCashOutflow }] : []).concat(outflowMoneyArr);
          const outflowSumTotal = sumArrayToMoney(outflowFilter.map((m: { outflowMoney: number }) => m.outflowMoney).concat([bankCashOutflow]));
          // 汇总流入的数据
          const inflowFilterArr = aliPayAndWeChatInflowOrOutflowArr.filter(
            (f: { billType: number }) => ![billTypeEnum.weChatChangeRecharge, billTypeEnum.aliPayBalanceRecharge].includes(f.billType),
          );
          const inflowMoneyArr = inflowFilterArr
            .map((m: { name: string; inflowMoney: number }) => ({
              name: m.name,
              money: m.inflowMoney,
            }))
            .filter((f: { money: number }) => f.money !== 0);
          const inflowChart = (bankCashInflow > 0 ? [{ name: bankCashName, money: bankCashInflow }] : []).concat(inflowMoneyArr);
          const inflowSumTotal = sumArrayToMoney(inflowFilterArr.map((m: { inflowMoney: number }) => m.inflowMoney).concat([bankCashInflow]));
          // 结果
          const result: ApiInflowOrOutflowMoneyResult = {
            outflowSumTotal,
            outflowChart,
            inflowSumTotal,
            inflowChart,
          };
          return {
            code: ApiCode.SUCCESS,
            result,
            message: '获取成功！',
          };
        })
        // 返回错误
        .catch((err) => {
          logger.error(`统计某时间范围内的方式流入/流出的金额 失败! ${err}`);
          return {
            code: ApiCode.ERROR,
            message: err || '获取失败！',
          };
        })
    );
  }

  /**
   * @description: 备份数据库Blog/money数据
   * @return {Promise<IResponse>}
   */
  public backupsCapital(): Promise<IResponse> {
    return (
      Promise.resolve()
        .then(async () => {
          // 判断store目录是否存在
          createStoreDir();
          // 判断json目录是否存在
          const jsonDir = `${storeDirStr}/json`;
          const hasJsonDir = existsSync(jsonDir);
          if (!hasJsonDir) {
            // 创建json目录
            mkdirSync(jsonDir);
            logger.log('创建json目录');
          }
          // 判断json/blog目录是否路径存在
          const blogDir = `${jsonDir}/${blogDatabaseName}`;
          const hasDir = existsSync(blogDir);
          if (!hasDir) {
            // 创建json/blog目录
            mkdirSync(blogDir);
            logger.log('创建json/blog目录');
          }
          return blogDir;
        })
        .then(async (blogDir) => {
          // 备份blog/bank
          const bankData = await this.bankService.findAllToData();
          const bankStr = JSON.stringify(bankData, null, '\t');
          writeFileSync(`${blogDir}/bank.json`, bankStr);
          logger.log('备份数据库blog/bank数据');
          // 备份blog/weChat
          const weChatData = await this.weChatService.findAllToData();
          const weChatStr = JSON.stringify(weChatData, null, '\t');
          writeFileSync(`${blogDir}/weChat.json`, weChatStr);
          logger.log('备份数据库blog/weChat数据');
          // 备份blog/aliPay
          const aliPayData = await this.aliPayService.findAllToData();
          const aliPayStr = JSON.stringify(aliPayData, null, '\t');
          writeFileSync(`${blogDir}/aliPay.json`, aliPayStr);
          logger.log('备份数据库blog/aliPay数据');
          return {
            code: ApiCode.SUCCESS,
            message: '备份成功！',
          };
        })
        // 返回错误
        .catch((err) => {
          logger.log(`备份数据库blog/money 失败! ${err}`);
          return {
            code: ApiCode.ERROR,
            message: err || '备份失败！',
          };
        })
    );
  }
}
