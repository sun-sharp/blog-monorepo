import { ApiWeChatUpload, WeChatBaseFields, WeChatCreateFields } from "/#/api/blog/money/we-chat";
import { FieldConfig } from "/#/api/common";

export const weChatBaseFieldsMap: Record<keyof WeChatBaseFields, FieldConfig> = {
  tradeTime: { label: '交易时间', type: 'string' }, // 账单交易发生的时间，格式如 "2024-01-15 10:30:00"
  tradeType: { label: '交易类型', type: 'string' }, // 交易的类别，如"微信红包"、"转账"等
  tradeOtherPerson: { label: '交易对方', type: 'string' }, // 交易对方的昵称或姓名
  tradeOtherPersonRemarks: { label: '交易对方备注', type: 'string' }, // 对交易对方的备注名
  goods: { label: '商品', type: 'string' }, // 交易涉及的商品名称或描述
  incomeOrPay: { label: '收/支', type: 'string' }, // 收入或支出标识，值为"收入"或"支出"
  moneyAmount: { label: '金额(元)', type: 'number' }, // 交易金额，单位为元
  otherCost: { label: '其它费用', type: 'number' }, // 其它附加费用
  paymentMethod: { label: '支付方式', type: 'string' }, // 支付使用的渠道，如"零钱"、"招商银行(0000)"等
  currentStatus: { label: '当前状态', type: 'string' }, // 交易的当前状态，如"已完成"、"已退款"等
  remarks: { label: '备注', type: 'string' }, // 交易备注信息
  explain: { label: '账单说明', type: 'string' }, // 账单的详细说明
  place: { label: '使用地点', type: 'string' }, // 交易发生的地点
};

export const weChatCreateFieldsMap: Record<keyof WeChatCreateFields, FieldConfig> = {
  inflowOrOutflow: { label: '流入/流出', type: 'number' }, // 1=流入, 2=流出，用于统一标识资金流向
  billType: { label: '账单类型', type: 'number' }, // 系统定义的账单分类，如"餐饮"、"交通"等
  billMethod: { label: '账单方式', type: 'number' }, // 系统定义的支付方式分类，如"微信零钱"、"银行卡"等
  balance: { label: '余额', type: 'number' }, // 交易后的账户余额
};

// ============ 3. 最终导入字段映射（基于 ApiWeChatUpload） ============
type ApiWeChatUploadKeys = keyof ApiWeChatUpload; // 自动推导为联合类型

// 对象的键必须恰好是 ApiWeChatUpload 的所有字段
export const weChatUploadFieldsMap: Record<keyof ApiWeChatUpload, FieldConfig> = {
  // 从 weChatBaseFieldsMap 选取的字段
  tradeTime: weChatBaseFieldsMap.tradeTime,
  tradeType: weChatBaseFieldsMap.tradeType,
  tradeOtherPerson: weChatBaseFieldsMap.tradeOtherPerson,
  goods: weChatBaseFieldsMap.goods,
  incomeOrPay: weChatBaseFieldsMap.incomeOrPay,
  moneyAmount: weChatBaseFieldsMap.moneyAmount,
  paymentMethod: weChatBaseFieldsMap.paymentMethod,
  currentStatus: weChatBaseFieldsMap.currentStatus,
  remarks: weChatBaseFieldsMap.remarks,
  // 从 weChatCreateFieldsMap 选取的字段
  billMethod: weChatCreateFieldsMap.billMethod,
  inflowOrOutflow: weChatCreateFieldsMap.inflowOrOutflow,
  billType: weChatCreateFieldsMap.billType,
};

// 如果需要数组形式，可通过 Object.values 转换
export const weChatUploadFields = Object.entries(weChatUploadFieldsMap).map(([key, meta]) => ({
  key: key as keyof ApiWeChatUpload, // 类型断言，确保键合法
  label: meta.label,
  type: meta.type,
}));;