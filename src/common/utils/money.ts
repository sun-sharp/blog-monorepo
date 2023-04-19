import { billTypeEnum, billMethodEnum } from '../enums/money.enum';

// 微信账单数据整体处理
export const weChatExcelTargetHandler = (target: any) => {
  const oldTarget = JSON.parse(JSON.stringify(target));
  const tradeType = oldTarget.tradeType;
  const currentStatus = oldTarget.currentStatus;
  const paymentMethod = oldTarget.paymentMethod;
  const tradeOtherPerson = oldTarget.tradeOtherPerson;
  if (['微信红包', '企业微信红包'].includes(tradeType)) {
    target.billType = billTypeEnum.redPacket;
  } else if (['美团平台商户'].includes(tradeOtherPerson)) {
    target.billType = billTypeEnum.mtOrder;
  } else if (['手机充值'].includes(tradeOtherPerson)) {
    target.billType = billTypeEnum.phoneBill;
  } else if (tradeOtherPerson.indexOf('超市') !== -1 || ['成都红旗连锁股份有限公司'].includes(tradeOtherPerson)) {
    target.billType = billTypeEnum.consumptionSupermarket;
  } else if (tradeType === '零钱充值') {
    target.billType = billTypeEnum.weChatChangeRecharge;
  } else if (['广州骑安'].includes(tradeOtherPerson)) {
    target.billType = billTypeEnum.trafficBicycle;
  }
  if (currentStatus === '已存入零钱' || paymentMethod === '零钱' || tradeType === '零钱充值') {
    target.billMethod = billMethodEnum.weChatChange;
  }
  if (tradeType === '零钱充值') {
    target['incomeOrPay'] = '收入';
  }
};

// 支付宝账单数据整体处理
export const aliPayExcelTargetHandler = (target: any) => {
  const oldTarget = JSON.parse(JSON.stringify(target));
  const tradeType = oldTarget.tradeType;
  const paymentMethod = oldTarget.paymentMethod;
  const transactionClassification = oldTarget.transactionClassification;
  const tradeOtherPerson = oldTarget.tradeOtherPerson;
  const productDescription = oldTarget.productDescription;
  if (paymentMethod === '余额') {
    target.billMethod = billMethodEnum.aliPayBalance;
  } else if (['余额宝'].includes(paymentMethod) || ['余额宝-笔笔攒-单笔攒入', '余额宝-单次转入'].includes(productDescription)) {
    target.billMethod = billMethodEnum.aliPayBalanceBaby;
  } else if (['花呗', '花呗&红包'].includes(paymentMethod)) {
    target.billMethod = billMethodEnum.aliPayHuaBei;
  } else if (['单车骑行卡抵扣'].includes(paymentMethod)) {
    target.billMethod = billMethodEnum.other;
  }
  // else if (paymentMethod.includes('中国农业银行')) {
  //   target.billMethod = billMethodEnum.agriculture;
  // } else if (paymentMethod.includes('中国工商银行')) {
  //   target.billMethod = billMethodEnum.business;
  // }
  if (
    transactionClassification === '交通出行' &&
    tradeOtherPerson === '成都金控数据服务有限公司' &&
    ['天府通扫码乘车', '天府通APP乘车'].includes(productDescription)
  ) {
    target.billType = billTypeEnum.trafficSubway;
  } else if (['余额宝-笔笔攒-单笔攒入', '余额宝-单次转入'].includes(productDescription)) {
    target.billType = billTypeEnum.aliPayBalanceBabyRecharge;
  } else if (tradeType === '餐饮美食') {
    target.billType = billTypeEnum.eatingRestaurant;
  } else if (paymentMethod === '余额' && ['充值-普通充值', '余额宝-转出到余额'].includes(productDescription)) {
    target.billType = billTypeEnum.aliPayBalanceRecharge;
  } else if (tradeType === '投资理财') {
    target.billType = billTypeEnum.manageMoneyMatters;
  } else if (productDescription.indexOf('手机充值') !== -1) {
    target.billType = billTypeEnum.phoneBill;
  } else if (['哈啰出行', '广州骑安科技有限公司'].includes(tradeOtherPerson)) {
    target.billType = billTypeEnum.trafficBicycle;
  } else if (['滴滴出行'].includes(tradeOtherPerson)) {
    target.billType = billTypeEnum.trafficTaxi;
  } else if (['成都金控数据服务有限公司'].includes(tradeOtherPerson)) {
    target.billType = billTypeEnum.trafficSubway;
  } else if (tradeOtherPerson.indexOf('京东便利店') !== -1 || tradeOtherPerson.indexOf('超市') !== -1 || ['红旗连锁'].includes(tradeOtherPerson)) {
    target.billType = billTypeEnum.consumptionSupermarket;
  } else if (['成都空港公共交通有限公司'].includes(tradeOtherPerson)) {
    target.billType = billTypeEnum.trafficTransit;
  } else if (productDescription === '借呗还款') {
    target.billType = billTypeEnum.returnBorrow;
  } else if (productDescription.indexOf('主动还款-花呗') !== -1) {
    target.billType = billTypeEnum.returnHuaBei;
  } else if (oldTarget.billMethod === billMethodEnum.aliPayTradeClosure) {
    target.billType = billTypeEnum.invalid;
  }
  if (
    ['充值-普通充值', '余额宝-单次转入', '借呗还款'].includes(productDescription) ||
    ['花呗'].includes(tradeOtherPerson) ||
    productDescription.indexOf('手机充值') !== -1
  ) {
    target['incomeOrPay'] = '收入';
  } else if (['借呗还款', '提现-快速提现'].includes(productDescription) || ['借呗'].includes(tradeOtherPerson)) {
    target['incomeOrPay'] = '支出';
  }
};

// 银行账单数据整体处理
export const bankExcelTargetHandler = (target: any) => {
  const oldTarget = JSON.parse(JSON.stringify(target));
  const explain = oldTarget['explain'];
  const tradeOtherPerson = oldTarget['tradeOtherPerson'];
  const tradeType = oldTarget['tradeType'];
  const tradeOtherPersonAccount = oldTarget['tradeOtherPersonAccount'];
  const tradeOtherPersonRemarks = oldTarget['tradeOtherPersonRemarks'];
  if (
    ['支付宝（中国）网络技术有限公司', '⽀付宝（中国）⽹络技术有限公司', '⽀付宝', '215500690', '蚂蚁基金'].includes(tradeOtherPerson) ||
    ['215500690'].includes(tradeOtherPersonAccount) ||
    ['⽀付宝'].includes(explain) ||
    ['支付宝'].includes(tradeOtherPersonRemarks)
  ) {
    target['bankBillType'] = billTypeEnum.bankWeChatUse;
  } else if (
    ['财付通'].includes(explain) ||
    ['243300133', '财付通支付科技有限公司', '微信转账', '微信零钱充值账户'].includes(tradeOtherPerson) ||
    ['243300133'].includes(tradeOtherPersonAccount) ||
    ['微信零钱提现'].includes(tradeType) ||
    ['财付通'].includes(tradeOtherPersonRemarks)
  ) {
    target['bankBillType'] = billTypeEnum.bankAliPayUse;
  } else if (['⼯资', '劳务'].includes(explain)) {
    target['bankBillType'] = billTypeEnum.basicCapital;
  } else if (!oldTarget['bankBillType']) {
    target['bankBillType'] = billTypeEnum.invalid;
  }
};
