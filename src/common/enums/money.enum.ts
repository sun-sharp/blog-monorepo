// 账单类型
export enum billTypeEnum {
  weChatTransit = 604, // 微信中转
  aliPayTransit = 605, // 支付宝中转
  invalid = 1001, // 无效账单
  basicCapital = 501, // 基本工资
  cashTransit = 701, // 现金中转
  cashSpend = 702, // 现金花费
  cashPartTransit = 703, // 现金部分中转
  redPacket = 2, // 微信红包
  trafficSubway = 136, // 交通-地铁
  aliPayBalanceBabyRecharge = 603, // 支付宝余额宝充值
}

// 账单方式
export enum billMethodEnum {
  business = 1, // 中国工商银行
  agriculture = 2, // 中国农业银行
  build = 3, // 中国建设银行
  civil = 4, // 民生银行
  attractInvestment = 5, // 招商银行
  weChatChange = 101, // 微信零钱
  aliPayBalance = 111, // 支付宝余额
  aliPayBalanceBaby = 112, // 支付宝余额宝
  aliPayHuaBei = 113, // 花呗
}
