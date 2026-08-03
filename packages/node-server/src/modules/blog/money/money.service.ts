import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { groupArray, sumArrayToMoney, uniqueArray } from 'src/common/array';
import { ApiCode } from 'src/common/enums/api-code.enum';
import { AliPayService } from './ali-pay/ali-pay.service';
import { BankService } from './bank/bank.service';
import { WeChatService } from './we-chat/we-chat.service';
import { billTypeEnum } from 'src/common/enums/money.enum';
import { categoryTypeEnum } from 'src/common/enums/category.enum';
import { CategoryService } from 'src/modules/capital/category/category.service';
import { ApiAliPayAndWeChatChild, ApiBankFlow, ApiBankFlowResult, ApiInflowOrOutflowMoneyResult, ApiMoneyBalanceResult } from '/#/api/blog/money';
import { ApiAggregateBillItem } from '/#/api/blog/money/aggregate';
import { ApiBank } from '/#/api/blog/money/bank';
import { IResponse } from '/#/common/common';
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { logger } from 'src/common/journal';
import { createStoreDir } from 'src/common/fs-mkdir';
import { storeDirStr } from 'src/common/constant/config';
import { useCustomConfig } from 'src/config';
import { BillUploadService } from './bill-upload/bill-upload.service';
import { StatisticsStartEndTimeDto } from 'src/common/dto/statistics-start-end-time.dto';
import { Bank } from 'src/schemas/blog/money/bank.schema';
import { AliPay } from 'src/schemas/blog/money/ali-pay.schema';
import { WeChat } from 'src/schemas/blog/money/we-chat.schema';
import { PaginateHandle } from 'src/common/paginate/paginate-handle';
import { nowDateFun } from 'src/common/date';
import { PageAggregateBillDto } from './dto/page-aggregate-bill.dto';
import { UpdateAggregateBillDto } from './dto/update-aggregate-bill.dto';
import { format } from 'date-fns';

const customConfig = useCustomConfig();
const { blogDatabaseName } = customConfig;

@Injectable()
export class MoneyService {
  constructor(
    @InjectModel(Bank.name, blogDatabaseName) private readonly bankModel: Model<Bank>,
    @InjectModel(AliPay.name, blogDatabaseName) private readonly aliPayModel: Model<AliPay>,
    @InjectModel(WeChat.name, blogDatabaseName) private readonly weChatModel: Model<WeChat>,
    private readonly bankService: BankService,
    private readonly weChatService: WeChatService,
    private readonly aliPayService: AliPayService,
    private readonly categoryService: CategoryService,
    private readonly billUploadService: BillUploadService,
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
                billTypeEnum.withdrawCivil,
                billTypeEnum.withdrawAttractInvestment,
                billTypeEnum.bankAliPayUse,
                billTypeEnum.bankWeChatUse,
                billTypeEnum.invalid,
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
            (f: { billType: number }) =>
              ![
                billTypeEnum.weChatChangeRecharge,
                billTypeEnum.aliPayBalanceRecharge,
                billTypeEnum.withdrawBusiness,
                billTypeEnum.withdrawAgriculture,
                billTypeEnum.withdrawBuild,
                billTypeEnum.withdrawCivil,
                billTypeEnum.withdrawAttractInvestment,
                billTypeEnum.invalid,
              ].includes(f.billType),
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
          // 备份blog/billUpload
          const billUploadData = await this.billUploadService.findAllToData();
          const billUploadStr = JSON.stringify(billUploadData, null, '\t');
          writeFileSync(`${blogDir}/billUpload.json`, billUploadStr);
          logger.log('备份数据库blog/billUpload数据');
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

  /**
   * @description: 三表聚合分页查询账单列表
   * @param {string} userId
   * @param {PageAggregateBillDto} body
   * @return {Promise<IResponse>}
   */
  public findAggregatePage(userId: string, body: PageAggregateBillDto): Promise<IResponse> {
    return Promise.resolve({ userId, body })
      .then(async ({ userId, body }) => {
        const { size, current, tradeOtherPerson, inflowOrOutflow, source, startTime, endTime, bankType, billType, billMethod, bankBillType } = body;
        const { limit, skip } = PaginateHandle(size, current);

        // 构建通用查询条件
        const buildMatch = (extra?: Record<string, any>): Record<string, any> => {
          const match: Record<string, any> = { userId: userId.toString(), ...extra };
          if (tradeOtherPerson) {
            match.$or = [
              { tradeOtherPerson: { $regex: tradeOtherPerson } },
              { tradeOtherPersonRemarks: { $regex: tradeOtherPerson } },
              { explain: { $regex: tradeOtherPerson } },
            ];
          }
          if (inflowOrOutflow) match.inflowOrOutflow = inflowOrOutflow;
          if (billType) match.billType = billType;
          if (billMethod) match.billMethod = billMethod;
          if (bankBillType) match.bankBillType = bankBillType;
          if (startTime && endTime) {
            const sTime = format(new Date(startTime), `yyyy-MM-dd 00:00:00`);
            const eTime = format(new Date(endTime), `yyyy-MM-dd 23:59:59`);
            match.tradeTime = { $gte: new Date(sTime), $lte: new Date(eTime) };
          }
          return match;
        };

        // 映射函数：将各表数据统一为 ApiAggregateBillItem
        const mapBank = (m: any): ApiAggregateBillItem => ({
          source: 'bank',
          billId: m._id,
          tradeTime: nowDateFun(m.tradeTime),
          tradeType: m.tradeType,
          tradeOtherPerson: m.tradeOtherPerson,
          tradeOtherPersonRemarks: m.tradeOtherPersonRemarks,
          incomeOrPay: m.incomeOrPay,
          moneyAmount: m.moneyAmount,
          otherCost: m.otherCost,
          inflowOrOutflow: m.inflowOrOutflow,
          explain: m.explain,
          place: m.place,
          balance: m.balance,
          bankType: m.bankType,
          voucherType: m.voucherType,
          voucherNo: m.voucherNo,
          tradeOtherPersonAccount: m.tradeOtherPersonAccount,
          bankBillType: m.bankBillType,
        });

        const mapAliPay = (m: any): ApiAggregateBillItem => ({
          source: 'aliPay',
          billId: m._id,
          tradeTime: nowDateFun(m.tradeTime),
          tradeType: m.tradeType,
          tradeOtherPerson: m.tradeOtherPerson,
          tradeOtherPersonRemarks: m.tradeOtherPersonRemarks,
          incomeOrPay: m.incomeOrPay,
          moneyAmount: m.moneyAmount,
          otherCost: m.otherCost,
          inflowOrOutflow: m.inflowOrOutflow,
          explain: m.explain,
          place: m.place,
          balance: m.balance,
          balanceBaby: m.balanceBaby,
          productDescription: m.productDescription,
          paymentMethod: m.paymentMethod,
          oppositeAccount: m.oppositeAccount,
          billType: m.billType,
          billMethod: m.billMethod,
        });

        const mapWeChat = (m: any): ApiAggregateBillItem => ({
          source: 'weChat',
          billId: m._id,
          tradeTime: nowDateFun(m.tradeTime),
          tradeType: m.tradeType,
          tradeOtherPerson: m.tradeOtherPerson,
          tradeOtherPersonRemarks: m.tradeOtherPersonRemarks,
          incomeOrPay: m.incomeOrPay,
          moneyAmount: m.moneyAmount,
          otherCost: m.otherCost,
          inflowOrOutflow: m.inflowOrOutflow,
          explain: m.explain,
          place: m.place,
          balance: m.balance,
          goods: m.goods,
          paymentMethod: m.paymentMethod,
          currentStatus: m.currentStatus,
          remarks: m.remarks,
          billType: m.billType,
          billMethod: m.billMethod,
        });

        const mapperMap: Record<string, (m: any) => ApiAggregateBillItem> = {
          bank: mapBank,
          aliPay: mapAliPay,
          weChat: mapWeChat,
        };
        const modelMap: Record<string, Model<any>> = {
          bank: this.bankModel,
          aliPay: this.aliPayModel,
          weChat: this.weChatModel,
        };

        // 指定来源：单表分页查询
        if (source) {
          const extra = source === 'bank' && bankType ? { bankType } : undefined;
          const findData = buildMatch(extra);
          const [total, arr] = await Promise.all([
            modelMap[source].find(findData).count(),
            modelMap[source].find(findData).sort({ tradeTime: -1 }).limit(limit).skip(skip).lean(),
          ]);
          return {
            code: ApiCode.SUCCESS,
            result: { current, list: arr.map(mapperMap[source]), size, total },
            message: '查询成功！',
          };
        }

        // 全部来源：使用 $unionWith 在数据库端聚合三表，统一排序分页
        const sources = ['bank', 'aliPay', 'weChat'] as const;
        const pipeline: any[] = [];

        sources.forEach((src, idx) => {
          const matchStage = buildMatch(src === 'bank' && bankType ? { bankType } : undefined);
          if (idx === 0) {
            pipeline.push({ $match: matchStage });
          } else {
            pipeline.push({ $unionWith: { coll: modelMap[src].collection.name, pipeline: [{ $match: matchStage }] } });
          }
        });

        pipeline.push({ $sort: { tradeTime: -1 } });
        pipeline.push({
          $facet: {
            metadata: [{ $count: 'total' }],
            data: [{ $skip: skip }, { $limit: limit }],
          },
        });

        const aggResult = await this.bankModel.aggregate(pipeline).exec();
        const facetData = aggResult[0] || { metadata: [], data: [] };
        const total = facetData.metadata[0]?.total || 0;
        const rawList: any[] = facetData.data || [];
        const list: ApiAggregateBillItem[] = rawList.map((m) => {
          if (m.bankType !== undefined || m.voucherType !== undefined) return mapBank(m);
          if (m.balanceBaby !== undefined || m.productDescription !== undefined) return mapAliPay(m);
          return mapWeChat(m);
        });

        return {
          code: ApiCode.SUCCESS,
          result: { current, list, size, total },
          message: '查询成功！',
        };
      })
      .catch((err) => {
        logger.error(`三表聚合分页查询账单列表 失败! ${err}`);
        return { code: ApiCode.ERROR, message: err || '查询失败！' };
      });
  }

  /**
   * @description: 三表聚合查询单条账单详情
   * @param {string} source
   * @param {string} billId
   * @return {Promise<IResponse>}
   */
  public findAggregateOne(source: string, billId: string): Promise<IResponse> {
    return Promise.resolve({ source, billId })
      .then(async ({ source, billId }) => {
        let result: ApiAggregateBillItem | null = null;

        if (source === 'bank') {
          const m = await this.bankModel.findOne({ _id: billId }).lean();
          if (!m) throw '银行账单不存在';
          result = {
            source: 'bank',
            billId: m._id,
            tradeTime: nowDateFun(m.tradeTime),
            tradeType: m.tradeType,
            tradeOtherPerson: m.tradeOtherPerson,
            tradeOtherPersonRemarks: m.tradeOtherPersonRemarks,
            incomeOrPay: m.incomeOrPay,
            moneyAmount: m.moneyAmount,
            otherCost: m.otherCost,
            inflowOrOutflow: m.inflowOrOutflow,
            explain: m.explain,
            place: m.place,
            balance: m.balance,
            bankType: m.bankType,
            voucherType: m.voucherType,
            voucherNo: m.voucherNo,
            tradeOtherPersonAccount: m.tradeOtherPersonAccount,
            bankBillType: m.bankBillType,
          };
        } else if (source === 'aliPay') {
          const m = await this.aliPayModel.findOne({ _id: billId }).lean();
          if (!m) throw '支付宝账单不存在';
          result = {
            source: 'aliPay',
            billId: m._id,
            tradeTime: nowDateFun(m.tradeTime),
            tradeType: m.tradeType,
            tradeOtherPerson: m.tradeOtherPerson,
            tradeOtherPersonRemarks: m.tradeOtherPersonRemarks,
            incomeOrPay: m.incomeOrPay,
            moneyAmount: m.moneyAmount,
            otherCost: m.otherCost,
            inflowOrOutflow: m.inflowOrOutflow,
            explain: m.explain,
            place: m.place,
            balance: m.balance,
            balanceBaby: m.balanceBaby,
            productDescription: m.productDescription,
            paymentMethod: m.paymentMethod,
            oppositeAccount: m.oppositeAccount,
            billType: m.billType,
            billMethod: m.billMethod,
          };
        } else if (source === 'weChat') {
          const m = await this.weChatModel.findOne({ _id: billId }).lean();
          if (!m) throw '微信账单不存在';
          result = {
            source: 'weChat',
            billId: m._id,
            tradeTime: nowDateFun(m.tradeTime),
            tradeType: m.tradeType,
            tradeOtherPerson: m.tradeOtherPerson,
            tradeOtherPersonRemarks: m.tradeOtherPersonRemarks,
            incomeOrPay: m.incomeOrPay,
            moneyAmount: m.moneyAmount,
            otherCost: m.otherCost,
            inflowOrOutflow: m.inflowOrOutflow,
            explain: m.explain,
            place: m.place,
            balance: m.balance,
            goods: m.goods,
            paymentMethod: m.paymentMethod,
            currentStatus: m.currentStatus,
            remarks: m.remarks,
            billType: m.billType,
            billMethod: m.billMethod,
          };
        } else {
          throw '账单来源不正确';
        }

        return { code: ApiCode.SUCCESS, result, message: '查询成功！' };
      })
      .catch((err) => {
        logger.error(`三表聚合查询单条账单详情 失败! ${err}`);
        return { code: ApiCode.ERROR, message: err || '查询失败！' };
      });
  }

  /**
   * @description: 三表聚合修改账单
   * @param {UpdateAggregateBillDto} body
   * @return {Promise<IResponse>}
   */
  public updateAggregate(body: UpdateAggregateBillDto): Promise<IResponse> {
    return Promise.resolve({ body })
      .then(async ({ body }) => {
        const { source, billId, tradeOtherPersonRemarks, inflowOrOutflow, explain, place, otherCost, bankBillType, billType, billMethod } = body;

        if (source === 'bank') {
          await this.bankModel.updateOne({ _id: billId }, { tradeOtherPersonRemarks, inflowOrOutflow, explain, place, otherCost, bankBillType });
        } else if (source === 'aliPay') {
          await this.aliPayModel.updateOne({ _id: billId }, { tradeOtherPersonRemarks, inflowOrOutflow, explain, place, billType, billMethod });
        } else if (source === 'weChat') {
          await this.weChatModel.updateOne({ _id: billId }, { tradeOtherPersonRemarks, inflowOrOutflow, explain, place, billType, billMethod });
        } else {
          throw '账单来源不正确';
        }

        return { code: ApiCode.SUCCESS, message: '修改成功！' };
      })
      .catch((err) => {
        logger.error(`三表聚合修改账单 失败! ${err}`);
        return { code: ApiCode.ERROR, message: err || '修改失败！' };
      });
  }
}
