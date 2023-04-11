// 微信枚举值
export enum weCharEnum {
  bankBillType = 604, // 账单类型-微信中转
}

// 支付宝枚举值
export enum aliPayEnum {
  bankBillType = 605, // 账单类型-支付宝中转
}

// 无效的
export enum invalidEnum {
  bankBillType = 1001, // 账单类型-无效账单
}

// 工资
export enum capitalEnum {
  bankBillType = 501, // 账单类型-基本工资
}

// 现金
export enum cashEnum {
  bankBillTypeForTransit = 701, // 账单类型-现金中转
  bankBillTypeForSpend = 702, // 账单类型-现金花费
  bankBillTypeForPartTransit = 703, // 账单类型-现金部分中转
}
