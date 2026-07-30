import { AliPayBaseFields, AliPayCreateFields, ApiAliPayUpload } from "/#/api/blog/money/ali-pay";
import { FieldConfig } from "/#/api/common";

export const aliPayBaseFieldsMap: Record<keyof AliPayBaseFields, FieldConfig> = {
  tradeTime: { label: '交易时间', type: 'string' }, // 账单交易发生的时间
  tradeType: { label: '交易类型', type: 'string' }, // 交易的类别，如"转账"、"消费"等
  tradeOtherPerson: { label: '交易对方', type: 'string' }, // 交易对方的名称
  tradeOtherPersonRemarks: { label: '交易对方备注', type: 'string' }, // 对交易对方的备注名
  productDescription: { label: '商品说明', type: 'string' }, // 交易涉及的商品说明
  incomeOrPay: { label: '收/支', type: 'string' }, // 收入或支出标识，值为"收入"或"支出"
  moneyAmount: { label: '金额(元)', type: 'number' }, // 交易金额，单位为元
  otherCost: { label: '其它费用', type: 'number' }, // 其它附加费用
  paymentMethod: { label: '收/付款方式', type: 'string' }, // 收款或付款的渠道，如"余额宝"、"花呗"等
  oppositeAccount: { label: '对方账号', type: 'string' }, // 交易对方的账号
  explain: { label: '账单说明', type: 'string' }, // 账单的详细说明
  place: { label: '使用地点', type: 'string' }, // 交易发生的地点
};

export const aliPayCreateFieldsMap: Record<keyof AliPayCreateFields, FieldConfig> = {
  inflowOrOutflow: { label: '流入/流出', type: 'number' }, // 1=流入, 2=流出，用于统一标识资金流向
  billType: { label: '账单类型', type: 'number' }, // 系统定义的账单分类
  billMethod: { label: '账单方式', type: 'number' }, // 系统定义的支付方式分类
  balance: { label: '余额', type: 'number' }, // 交易后的账户余额
  balanceBaby: { label: '余额宝', type: 'number' }, // 交易后的余额宝余额
};

// ============ 3. 最终导入字段映射（基于 ApiAliPayUpload） ============
type ApiAliPayUploadKeys = keyof ApiAliPayUpload; // 自动推导为联合类型

// 对象的键必须恰好是 ApiAliPayUpload 的所有字段
export const aliPayUploadFieldsMap: Record<keyof ApiAliPayUpload, FieldConfig> = {
  // 从 aliPayBaseFieldsMap 选取的字段
  tradeTime: aliPayBaseFieldsMap.tradeTime,
  tradeType: aliPayBaseFieldsMap.tradeType,
  tradeOtherPerson: aliPayBaseFieldsMap.tradeOtherPerson,
  oppositeAccount: aliPayBaseFieldsMap.oppositeAccount,
  productDescription: aliPayBaseFieldsMap.productDescription,
  incomeOrPay: aliPayBaseFieldsMap.incomeOrPay,
  moneyAmount: aliPayBaseFieldsMap.moneyAmount,
  paymentMethod: aliPayBaseFieldsMap.paymentMethod,
  // 从 aliPayCreateFieldsMap 选取的字段
  billMethod: aliPayCreateFieldsMap.billMethod,
  inflowOrOutflow: aliPayCreateFieldsMap.inflowOrOutflow,
  billType: aliPayCreateFieldsMap.billType,
  // 交易状态（仅在导入数据中存在）
  tradeStatus: { label: '交易状态', type: 'string' },
};

// 如果需要数组形式，可通过 Object.values 转换
export const aliPayUploadFields = Object.entries(aliPayUploadFieldsMap).map(([key, meta]) => ({
  key: key as keyof ApiAliPayUpload, // 类型断言，确保键合法
  label: meta.label,
  type: meta.type,
}));