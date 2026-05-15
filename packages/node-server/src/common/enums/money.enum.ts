// 账单类型
export enum billTypeEnum {
  redPacket = 2, // 红包
  parents = 3, // 父母
  manageMoneyMatters = 5, // 理财
  interest = 8, // 利息
  waterElectricFee = 17, // 水电费
  phoneBill = 20, // 话费
  consumptionClothingShoes = 102, // 消费-衣鞋
  consumptionSupermarket = 103, // 消费-超市
  trafficTrain = 131, // 交通-火车
  trafficBicycle = 132, // 交通-单车
  trafficTaxi = 134, // 交通-打车
  trafficSubway = 136, // 交通-地铁
  trafficTransit = 138, // 交通-公交
  eatingDish = 141, // 吃-果蔬肉
  eatingRestaurant = 142, // 吃-餐馆
  eatingSnack = 143, // 吃-小吃
  withdrawBusiness = 201, // 转入-中国工商银行
  withdrawAgriculture = 202, // 转入-中国农业银行
  withdrawBuild = 203, // 转入-中国建设银行
  withdrawCivil = 204, // 转入-民生银行
  withdrawAttractInvestment = 205, // 转入-招商银行
  returnHuaBei = 253, // 归还-花呗
  returnBorrow = 255, // 归还-借呗
  medicalInsurance = 306, // 医疗-保险
  basicCapital = 501, // 基本工资
  accumulationFund = 504, // 公积金
  companyReimbursement = 505, // 公司报销
  weChatChangeRecharge = 601, // 微信零钱充值
  aliPayBalanceRecharge = 602, // 支付宝余额充值
  aliPayBalanceBabyRecharge = 603, // 支付宝余额宝充值
  bankWeChatUse = 604, // 银行微信使用
  bankAliPayUse = 605, // 银行支付宝使用
  jdPurchase = 611, // 京东购买
  taoBaoPurchase = 621, // 淘宝购买
  mtOrder = 631, // 美团订单
  pinDuoDuoPurchase = 641, // 拼多多购买
  cashTransit = 701, // 现金中转
  cashSpend = 702, // 现金花费
  cashPartTransit = 703, // 现金部分中转
  invalid = 1001, // 无效账单
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
  aliPayTradeClosure = 901, // 支付宝交易关闭
  other = 1001, // 其它
}

// 账单导入类型
export enum billUploadTypeEnum {
  weChat = 1, // 微信账单
  aliPay = 2, // 支付宝账单
  bank = 3, // 银行账单
}
